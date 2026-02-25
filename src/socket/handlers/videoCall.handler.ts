import { Socket, Server } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

// Store for active calls
const activeCalls = new Map<
  string,
  {
    callerId: string;
    receiverId: string;
    status: 'ringing' | 'connected' | 'ended';
    startTime?: Date;
  }
>();

/**
 * Video call handler - handles real-time video/audio call signaling
 */
export function registerVideoCallHandlers(io: Server, socket: AuthenticatedSocket) {
  const userId = socket.userId;

  if (!userId) {
    return;
  }

  /**
   * Initiate a call
   */
  socket.on('call:initiate', (data: { receiverId: string; callType: 'VIDEO' | 'AUDIO' }) => {
    const { receiverId, callType } = data;
    const callId = `call_${userId}_${receiverId}_${Date.now()}`;

    // Store call info
    activeCalls.set(callId, {
      callerId: userId,
      receiverId,
      status: 'ringing',
    });

    // Notify the receiver
    io.to(`user:${receiverId}`).emit('call:incoming', {
      callId,
      callerId: userId,
      callType,
    });

    // Confirm to caller
    socket.emit('call:initiated', {
      callId,
      receiverId,
      callType,
    });

    // Auto-timeout after 30 seconds if not answered
    setTimeout(() => {
      const call = activeCalls.get(callId);
      if (call && call.status === 'ringing') {
        activeCalls.delete(callId);
        io.to(`user:${userId}`).emit('call:timeout', { callId });
        io.to(`user:${receiverId}`).emit('call:timeout', { callId });
      }
    }, 30000);
  });

  /**
   * Accept incoming call
   */
  socket.on('call:accept', (data: { callId: string }) => {
    const { callId } = data;
    const call = activeCalls.get(callId);

    if (!call || call.receiverId !== userId) {
      socket.emit('call:error', { error: 'Call not found or unauthorized' });
      return;
    }

    call.status = 'connected';
    call.startTime = new Date();
    activeCalls.set(callId, call);

    // Notify caller that call was accepted
    io.to(`user:${call.callerId}`).emit('call:accepted', { callId });

    // Join both users to a call room
    socket.join(`call:${callId}`);
    io.to(`user:${call.callerId}`).emit('call:join', { callId });
  });

  /**
   * Reject incoming call
   */
  socket.on('call:reject', (data: { callId: string }) => {
    const { callId } = data;
    const call = activeCalls.get(callId);

    if (!call) {
      return;
    }

    activeCalls.delete(callId);

    // Notify caller
    io.to(`user:${call.callerId}`).emit('call:rejected', { callId });
  });

  /**
   * End call
   */
  socket.on('call:end', (data: { callId: string }) => {
    const { callId } = data;
    const call = activeCalls.get(callId);

    if (!call) {
      return;
    }

    const duration = call.startTime
      ? Math.floor((Date.now() - call.startTime.getTime()) / 1000)
      : 0;

    activeCalls.delete(callId);

    // Notify both parties
    io.to(`call:${callId}`).emit('call:ended', {
      callId,
      duration,
      endedBy: userId,
    });

    // Also notify directly in case they're not in the room
    io.to(`user:${call.callerId}`).emit('call:ended', { callId, duration });
    io.to(`user:${call.receiverId}`).emit('call:ended', { callId, duration });
  });

  /**
   * WebRTC signaling - send offer
   */
  socket.on('webrtc:offer', (data: { callId: string; offer: any }) => {
    const { callId, offer } = data;
    socket.to(`call:${callId}`).emit('webrtc:offer', { callId, offer, from: userId });
  });

  /**
   * WebRTC signaling - send answer
   */
  socket.on('webrtc:answer', (data: { callId: string; answer: any }) => {
    const { callId, answer } = data;
    socket.to(`call:${callId}`).emit('webrtc:answer', { callId, answer, from: userId });
  });

  /**
   * WebRTC signaling - ICE candidate
   */
  socket.on('webrtc:ice-candidate', (data: { callId: string; candidate: any }) => {
    const { callId, candidate } = data;
    socket.to(`call:${callId}`).emit('webrtc:ice-candidate', { callId, candidate, from: userId });
  });

  /**
   * Toggle audio/video
   */
  socket.on(
    'call:toggle',
    (data: { callId: string; type: 'audio' | 'video'; enabled: boolean }) => {
      const { callId, type, enabled } = data;
      socket.to(`call:${callId}`).emit('call:toggle', {
        callId,
        userId,
        type,
        enabled,
      });
    },
  );

  // Clean up on disconnect
  socket.on('disconnect', () => {
    // End any active calls involving this user
    activeCalls.forEach((call, callId) => {
      if (call.callerId === userId || call.receiverId === userId) {
        const otherUserId = call.callerId === userId ? call.receiverId : call.callerId;
        io.to(`user:${otherUserId}`).emit('call:ended', {
          callId,
          endedBy: userId,
          reason: 'disconnect',
        });
        activeCalls.delete(callId);
      }
    });
  });
}

export default registerVideoCallHandlers;
