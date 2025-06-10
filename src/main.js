import './style.scss'
import './drag-drop.js'
import * as KonvaJS from "./konva.js";

'./konva.js'
import {jsPDF} from "jspdf";
import "@fontsource/montserrat";


const form = document.querySelector('#car-form')
const formContainer = document.querySelector('#form-container')

const WEBHOOK_URL = 'https://hook.eu2.make.com/pqgynh57p9p1oilg8mwskjoltbm7fx0e'

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB en octets

form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(form);
    
    // Vérifier la taille des fichiers
    for (let [key, value] of formData.entries()) {
        if (value instanceof File && value.size > MAX_FILE_SIZE) {
            alert(`Le fichier ${value.name} dépasse la limite de 2MB`);
            return;
        }
    }

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    doc.setFont("Montserrat");


    const originalStyle = formContainer.getAttribute("style");


    formContainer.style.margin = "0";
    formContainer.style.padding = "0";
    formContainer.style.maxWidth = "none";
    formContainer.style.transform = "none";
    formContainer.style.position = "static";


    // Elements to hide
    const toolbar = document.getElementById("toolbar");
    const konva = document.getElementById("konva-container");
    const send = document.getElementById("send");

    // Temporarily hide elements
    toolbar.classList.remove('d-flex')
    toolbar.classList.add('d-none')
    konva.style.display = "none";
    send.style.display = "none";


    const pdf = new FormData()

    await new Promise((resolve) => {
        doc.html(formContainer, {
            callback: async function (doc) {
                const totalPages = doc.internal.getNumberOfPages();
                for (let i = 0; i < 7; i++) {
                    doc.deletePage(totalPages - i);
                }

                doc.addPage();

                const dataURL = KonvaJS.stage.toDataURL({
                    pixelRatio: 1,
                    mimeType: 'image/jpeg',
                    quality: 0.7 // adjust between 0.5–0.9
                });

                const pageWidth = doc.internal.pageSize.getWidth();
                const margin = 10;
                const usableWidth = pageWidth - margin * 2;

                // ➕ Wrap image load in a Promise
                await new Promise((resolveImage) => {
                    const image = new Image();
                    image.onload = async () => {
                        const aspectRatio = image.height / image.width;
                        const imageHeight = usableWidth * aspectRatio;

                        doc.addImage(dataURL, 'JPEG', margin, margin, usableWidth, imageHeight);

                        // ✅ Output PDF as blob and append to formData
                        const pdfBlob = doc.output("blob");
                        formData.append('pdf', pdfBlob, 'car-check.pdf');
                        pdf.append('pdf', pdfBlob, 'car-check.pdf');

                        resolveImage(); // resolve once everything is done
                    };
                    image.src = dataURL;
                });

                resolve(); // resolve the outer Promise once all is done
            },
            x: 0,
            y: 10,
            html2canvas: {
                scale: 0.25,
                useCORS: true
            },
            width: 190,
            windowWidth: formContainer.offsetWidth
        });
    });



    formContainer.setAttribute('style', originalStyle)

    toolbar.classList.remove('d-none')
    toolbar.classList.add('d-flex')
    konva.style.display = "";
    send.style.display = "";


    const formDataObject = Object.fromEntries(formData.entries())
    console.log(formDataObject)


    // Convertir les fichiers en base64
    const formDataToSend = new FormData();
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            const base64 = await convertFileToBase64(value);
            formDataToSend.append(key, base64);
        } else {
            formDataToSend.append(key, value);
        }
    }

    // Ajouter le PDF en base64
    if (formData.has('pdf')) {
        const pdfFile = formData.get('pdf');
        const pdfBase64 = await convertFileToBase64(pdfFile);
        formDataToSend.append('pdf', pdfFile);
    }

    const sendFormToMake = async () => {
        return await fetch(WEBHOOK_URL, {
            method: "POST",
            body: formDataToSend
        });
    };

    const data = await sendFormToMake();
    console.log(data);
});

// Fonction utilitaire pour convertir un fichier en base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}