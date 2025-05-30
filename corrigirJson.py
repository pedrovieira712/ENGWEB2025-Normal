#!/usr/bin/env python3
import json
import sys

def transform_dataset(json_data):
    transformed_data = []
    
    for key, edicao in json_data.items():
        transformed_edicao = {
            "_id": edicao["id"],  
            "anoEdicao": int(edicao["anoEdição"]),  
            "organizacao": edicao["organizacao"],
            "vencedor": edicao.get("vencedor", None), 
            "musicas": []
        }
        

        for musica in edicao.get("musicas", []):
            transformed_musica = {
                "id": musica.get("id"),
                "titulo": musica.get("título"),
                "pais": musica.get("país"),
                "interprete": musica.get("intérprete"),
                "compositor": musica.get("compositor", None),
                "letra": musica.get("letra", None),
                "link": musica.get("link", None)
            }
            transformed_edicao["musicas"].append(transformed_musica)
        
        transformed_data.append(transformed_edicao)
    
    transformed_data.sort(key=lambda x: x["anoEdicao"])
    
    return transformed_data

def main():
    if len(sys.argv) != 2:
        print("python3 corrigirJson.py <json_original>")
        sys.exit(1)
    
    arquivo_original = sys.argv[1]
    arquivo_novo = "dataset_eurovision_corrigido.json"
    
    try:
        with open(arquivo_original, 'r', encoding='utf-8') as f:
            original_data = json.load(f)
    
        transformed_data = transform_dataset(original_data)
        
        with open(arquivo_novo, 'w', encoding='utf-8') as f:
            json.dump(transformed_data, f, indent=2, ensure_ascii=False)
        print(f"Novo dataset: {arquivo_novo}")
        
    except FileNotFoundError:
        print(f"Arquivo não encontrado: {arquivo_original}")

if __name__ == "__main__":
    main()
