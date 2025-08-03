document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const resultsDiv = document.getElementById('results');
    const previewImage = document.getElementById('previewImage');
    const predictionResult = document.getElementById('predictionResult');
    const confidenceValue = document.getElementById('confidenceValue');
    const probabilitiesList = document.getElementById('probabilitiesList');
    const errorBox = document.getElementById('errorBox');
    
    
    const classFullNames = {
        'akiec': 'Carcinoma de células escamosas',
        'bcc': 'Carcinoma basocelular',
        'bkl': 'Lesão benigna semelhante a queratose',
        'df': 'Dermatofibroma',
        'mel': 'Melanoma',
        'nv': 'Nevo melanocítico',
        'vasc': 'Lesões vasculares'
    };
    
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.querySelector('.upload-box').style.backgroundColor = '#f0f8ff';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.querySelector('.upload-box').style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.querySelector('.upload-box').style.backgroundColor = '';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload();
        }
    });
    
    fileInput.addEventListener('change', handleFileUpload);
    
    function handleFileUpload() {
        const file = fileInput.files[0];
        
        if (!file) return;
        
        // Verificar tipo de arquivo
        if (!file.type.match('image.*')) {
            showError('Por favor, selecione um arquivo de imagem (JPEG, PNG)');
            return;
        }
        
        // Verificar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('O arquivo é muito grande (máximo 5MB)');
            return;
        }
        
        
        errorBox.style.display = 'none';
        
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            uploadArea.querySelector('img').src = e.target.result;
            
            
            uploadFile(file);
        };
        reader.readAsDataURL(file);
    }
    
    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                showResults(data);
            }
        })
        .catch(error => {
            showError('Erro ao processar a imagem: ' + error.message);
        });
    }
    
    function showResults(data) {
        
        previewImage.src = `/static/uploads/${data.filename}`;
        
        // Mostrar resultados
        predictionResult.textContent = classFullNames[data.prediction] || data.prediction;
        confidenceValue.textContent = `${(data.confidence * 100).toFixed(2)}%`;
        
        // Atualizar probabilidades
        probabilitiesList.innerHTML = '';
        for (const [className, prob] of Object.entries(data.probabilities)) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${classFullNames[className] || className}:</strong> ${(prob * 100).toFixed(2)}%`;
            probabilitiesList.appendChild(li);
        }
        
        // Mostrar seção de resultados
        resultsDiv.style.display = 'block';
    }
    
    function showError(message) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
    }
});