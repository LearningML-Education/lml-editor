/**
 * Esta función abre un File Picker para seleccionar imágenes 
 * 
 * @returns {Promise()} - una promesa que al resolverse ofrece una array con 
 *                        todos las imágenes cargadas en Base64
 */
export function uploadImages(multiple = true) {
  const pickerOpts = {
    types: [
      {
        description: "Images",
        accept: {
          "images/*": [".jpg", ".png"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: multiple,
  };

  let promises = [];

  return window.showOpenFilePicker(pickerOpts).then(filesHandle => {
    for (let fileHandle of filesHandle) {
       promises.push(fileHandle.getFile().then(file => {
        const reader = new FileReader();
        // Leer el contenido del archivo como base64
        reader.readAsDataURL(file);

        return new Promise((resolve, reject) => {
          reader.onload = function (e) {
            const base64String = e.target.result;
            resolve(base64String);
          };
        });
      }));
    }
    return Promise.all(promises);
  });
}