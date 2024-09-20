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
                const sonidosDiv = document.getElementById('sonidos');                                                           
                this.audioChunks.forEach((chunk, index) => {                                                                     
                    const audioBlob = new Blob([chunk], { type: 'audio/wav' });                                                  
                    const audioUrl = URL.createObjectURL(audioBlob);                                                             
                                                                                                                                 
                    // Crear un botón para reproducir el audio                                                                   
                    const playButton = document.createElement('button');                                                         
                    playButton.className = 'button is-primary';                                                                  
                    playButton.innerHTML = `<i class="fa-solid fa-play"></i> Sample-${index + 1}`;                 
                                                                                                                                 
                    // Añadir evento de clic para reproducir el audio                                                            
                    playButton.addEventListener('click', () => {                                                                 
                        const audio = new Audio(audioUrl);                                                                       
                        audio.play();                                                                                            
                    });                                                                                                          
                                                                                                                                 
                    sonidosDiv.appendChild(playButton);                                                                          
                    sonidosDiv.appendChild(document.createElement('br'));                                                        
                });                                                                                                              
                resolve(this.audioChunks);                                                                                       
            };                                                                                                                   
        });                                                                                                                      
    }       
}
