# 🧠 DermaI — Detecção de Câncer de Pele com Flask e Deep Learning

Este projeto consiste em um sistema de **classificação de câncer de pele** baseado em imagens, desenvolvido com **Flask** e **TensorFlow/Keras**, utilizando a base de dados **HAM10000**. O objetivo é criar uma ferramenta web simples que permita o upload de imagens e retorne a previsão do tipo de lesão cutânea.

## 🚀 Funcionalidades

- Upload de imagens de lesões de pele (formatos PNG, JPG, JPEG).
- Classificação automática com base em um modelo treinado com a base HAM10000.
- Retorno da **classe predita**, **nível de confiança** e **probabilidades para cada classe**.
- Interface simples via navegador.

## 🗂️ Estrutura do Projeto

📁 static/uploads/ 
📁 templates/index.html
📄 app.py # Aplicação Flask (backend)
📄 skin_cancer_model_final.keras 
📄 AnalisePreparaDatasetHAM10000.ipynb #
📄 ModeloClassificacao2.ipynb 



## 🧬 Classes de Lesões Reconhecidas

O modelo foi treinado para reconhecer as seguintes classes:

- `akiec` — Carcinoma intraepidérmico de células escamosas (queratinócitos)
- `bcc` — Carcinoma basocelular
- `bkl` — Lesões benignas da queratina
- `df` — Dermatofibroma
- `mel` — Melanoma
- `nv` — Nevo (pintas comuns)
- `vasc` — Lesões vasculares

## 📦 Requisitos

- Python 3.8+
- Flask
- TensorFlow
- NumPy
- Pillow

## 1. Clone o repositório
git clone https://github.com/gustavsonbarros/dermai-system-web.git

## 2. Acesse a pasta do projeto
cd dermai-system-web

## 3. (Opcional) Crie um ambiente virtual
python -m venv venv

## 4. Ative o ambiente virtual
## No Windows:
venv\Scripts\activate
## No Linux/macOS:
source venv/bin/activate

## 5. Instale as dependências
pip install -r requirements.txt
# ou, se ainda não tiver o requirements.txt:
pip install flask tensorflow pillow numpy

## 6. Rode a aplicação Flask
python app.py

## 🌐 Acesse no navegador:
http://localhost:5000
