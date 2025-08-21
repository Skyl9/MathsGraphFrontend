export type RelationType = 'utilise' | 'implication' | 'equivalence' | 'reciproque';

export interface Relations {
    id: number;
    concept_source: { "id": number, nom: string };
    concept_cible: { "id": number, nom: string };
    type_relation: RelationType;
    description: string;
}