// @ts-check

// connect to our root path
const socket = io('/');

// init with undefined as we want the server to be responsible for generating an ID
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001',
});

const peers = {};

// As soon as we connect with our Peer server and obtain an ID
myPeer.on('open', (id) => {
    // send an event to our server
    socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-disconnected', (userId) => {
    if (peers[userId]) {
        peers[userId].close();
    }
});

const videoGrid = document.querySelector('#video-grid');
const myVideo = createVideoElement(true);

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        addVideoStream(myVideo, stream);
        handleRecieveCall(stream);
        handleUserConnected(stream);
    });

/**
 * @return {HTMLVideoElement} A video element
 */
function createVideoElement(isMuted = false) {
    const video = document.createElement('video');
    video.muted = isMuted;
    return video;
}

/**
 *
 * @param {HTMLVideoElement} video
 * @param {MediaStream} stream
 */
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    videoGrid.append(video);
}

/**
 *
 * @param {MediaStream} stream
 */
function handleUserConnected(stream) {
    socket.on('user-connected', (userId) => {
        const call = myPeer.call(userId, stream); // Call user and send our video and audio stream
        const video = createVideoElement();

        // Listen for response when we get back the other user's stream
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });

        // When someone leaves the video call
        call.on('close', () => video.remove());

        peers[userId] = call;
    });
}

/**
 *
 * @param {MediaStream} stream
 */
function handleRecieveCall(stream) {
    myPeer.on('call', (call) => {
        call.answer(stream);
        const video = createVideoElement();

        // Listen for response when we get back the other user's stream
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    });
}
