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
    
    playBase64Audio(base64Audio) {
        // Convierte la cadena Base64 en un blob de audio
        let audioBlob = this.base64ToAudioBlob(base64Audio);
        
        // Crea una URL para el blob
        let audioUrl = URL.createObjectURL(audioBlob);
        
        // Crea un nuevo elemento de audio
        let audio = new Audio(audioUrl);
        
        // Reproduce el audio
        audio.play();
    }
    
    base64ToAudioBlob(base64String) {
    
        // Convierte la cadena base64 en un array de bytes
        let binaryString = atob(base64String);
        let byteArray = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
    
        // Crea un blob de tipo audio (puedes cambiar el tipo de mime si es necesario)
        return new Blob([byteArray], { type: 'audio/wav' });
    }
}
