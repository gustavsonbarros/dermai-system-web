import os
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from PIL import Image, UnidentifiedImageError
import numpy as np
import logging


os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  

app = Flask(__name__)


UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = 'skin_cancer_model_final.keras'


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    
    model = load_model(MODEL_PATH)
    model.make_predict_function()  
    logger.info("Modelo carregado com sucesso")
except Exception as e:
    logger.error(f"Erro ao carregar modelo: {str(e)}")
    raise RuntimeError("Falha ao inicializar o modelo") from e

class_names = ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc']

def allowed_file(filename):
    """Verifica se a extensão do arquivo é permitida"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Pré-processa a imagem para o modelo"""
    try:
        img = Image.open(image_path)
        img = img.resize((224, 224))
        
        # Converter para RGB se necessário
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except UnidentifiedImageError:
        logger.error(f"Arquivo de imagem inválido: {image_path}")
        raise ValueError("Arquivo de imagem corrompido ou formato inválido")
    except Exception as e:
        logger.error(f"Erro no pré-processamento: {str(e)}")
        raise RuntimeError("Erro ao processar imagem") from e

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Tipo de arquivo não permitido'}), 400

        filename = secure_filename(file.filename)
        upload_path = os.path.join(UPLOAD_FOLDER, filename)
        
        
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file.save(upload_path)
        
        
        img_array = preprocess_image(upload_path)
        predictions = model.predict(img_array)
        predicted_class = class_names[np.argmax(predictions)]
        confidence = float(np.max(predictions))
        
        
        probabilities = {
            class_names[i]: float(predictions[0][i]) 
            for i in range(len(class_names))
        }
        
        return jsonify({
            'filename': filename,
            'prediction': predicted_class,
            'confidence': round(confidence, 4),
            'probabilities': probabilities
        })
        
    except Exception as e:
        logger.error(f"Erro durante upload: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  
    app.run(host='0.0.0.0', port=5000, debug=False)  