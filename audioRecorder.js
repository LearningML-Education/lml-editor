async function recordAndSplitAudio() {
    const audioChunks = [];
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.start();

    console.log("Grabando...");

    return new Promise((resolve) => {
        setInterval(() => {
            if (audioChunks.length > 0) {
                const audioBlob = new Blob(audioChunks.splice(0, audioChunks.length), { type: 'audio/wav' });
                resolve(audioBlob);
                console.log("Segmento de 2 segundos grabado.");
            }
        }, 2000);
    });
}
