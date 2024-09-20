export class AudioRecorder {
    constructor() {
        this.audioChunks = [];
        this.mediaRecorder = null;
        this.recordingInterval = null;
        this.stream = null;
    }

    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(s => {
                this.stream = s;
                this.audioChunks = [];
                this.mediaRecorder = new MediaRecorder(this.stream);

                this.mediaRecorder.ondataavailable = event => {
                    this.audioChunks.push(event.data);
                };

                // Comenzar la grabación y dividirla cada 2 segundos
                this.mediaRecorder.start();
                this.recordingInterval = setInterval(() => {
                    this.mediaRecorder.stop();  // Detener cada 2 segundos
                    this.mediaRecorder.start(); // Reiniciar grabación inmediatamente
                }, 2000);

            })
            .catch(err => {
                console.error('Error al acceder al micrófono:', err);
            });
    }

    stopRecording() {                                                                                                            
        clearInterval(this.recordingInterval);                                                                                   
        this.mediaRecorder.stop();                                                                                               
        this.stream.getTracks().forEach(track => track.stop());                                                                  
        return new Promise(resolve => {                                                                                          
            this.mediaRecorder.onstop = () => {                                                                                                                                                                                                           
                resolve(this.audioChunks);                                                                                       
            };                                                                                                                   
        });                                                                                                                      
    }       
}
