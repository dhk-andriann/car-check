document.querySelectorAll('.dropzone').forEach(dropzone => {
  const input = dropzone.querySelector('input');

  dropzone.addEventListener('click', () => input.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      input.files = e.dataTransfer.files;
      dropzone.querySelector('p').textContent = e.dataTransfer.files[0].name;
    }
  });

  input.addEventListener('change', () => {
    if (input.files.length) {
      dropzone.querySelector('p').textContent = input.files[0].name;
    }
  });
});