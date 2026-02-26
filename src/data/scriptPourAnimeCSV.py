import pandas as pd

def clean_anime_csv(input_file, output_file):
    # 1. Charger le CSV
    df = pd.read_csv(input_file)

    # 2. Filtrer par popularité (Members > 650,000)
    df['Members'] = pd.to_numeric(df['Members'], errors='coerce').fillna(0)
    df = df[df['Members'] > 650000]

    # 3. Filtrer les noms anglais (Supprimer si 'UNKNOWN' ou vide)
    # On s'assure que la colonne existe et on filtre
    if 'English name' in df.columns:
        df = df[df['English name'].notna()]
        df = df[df['English name'].str.upper() != 'UNKNOWN']
    else:
        print("Attention : La colonne 'English name' est absente du fichier source.")

    # 4. Nettoyer les Episodes
    df['Episodes'] = df['Episodes'].replace('Unknown', 0)
    df['Episodes'] = pd.to_numeric(df['Episodes'], errors='coerce').fillna(0).astype(int)

    # 5. Garder seulement les deux premiers Genres
    def limit_genres(genre_str):
        if pd.isna(genre_str):
            return ""
        genres_list = [g.strip() for g in str(genre_str).split(',')]
        return ", ".join(genres_list[:2])

    df['Genres'] = df['Genres'].apply(limit_genres)
    
    # Extraction de l'année
    df['Aired'] = df['Aired'].str.extract(r'(\d{4})')

    # 6. Sélectionner uniquement les colonnes demandées
    columns_to_keep = ['anime_id', 'English name', 'Genres', 'Episodes', 'Aired', 'Studios', "Image URL", "Synopsis"]
    
    # Vérification de sécurité pour ne pas faire planter le script si une colonne manque
    existing_columns = [col for col in columns_to_keep if col in df.columns]
    df_final = df[existing_columns]

    # 7. Sauvegarder le nouveau CSV
    df_final.to_csv(output_file, index=False, encoding='utf-8')
    print(f"Nettoyage terminé ! {len(df_final)} animés conservés dans {output_file}")

# Utilisation :
clean_anime_csv('/content/anime-dataset-2023.csv', 'anime_pour_supabase.csv')