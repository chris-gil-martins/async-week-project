import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import { useSocket } from '../contexts/SocketContext';

const Video = ({ streamerId, userId }) => {
  const socket = useSocket();

  const [stream, setStream] = useState(null);
  const [peer] = useState(new Peer());
  const streamVideo = useRef();

  useEffect(() => {
    if (socket) {
      if (streamerId === userId) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
          setStream(currentStream);
          streamVideo.current.srcObject = currentStream;

          peer.on('open', function (id) {
            socket.emit('joinHost', userId);

            socket.on('requestJoin', ({ visitor }) => {
              console.log('request received', visitor);
              peer.call(visitor, currentStream);
            });
          });
        });
      } else {
        peer.on('open', function (id) {
          socket.emit('joinStream', { streamer: streamerId, visitor: id });

          peer.on('call', function (call) {
            console.log('received call');
            call.answer();

            call.on('stream', function (stream) {
              streamVideo.current.srcObject = stream;
            });
          });
        });
      }
    }
  }, [streamerId, socket]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
      if (socket) {
        socket.removeAllListeners('requestJoin');
      }
    };
  }, [stream, socket]);

  return (
    <video
      playsInline
      muted={userId === streamerId}
      ref={streamVideo}
      autoPlay
      style={{ objectFit: 'cover' }}
    />
  );
};

export default Video;
