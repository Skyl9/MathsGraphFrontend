import React, {useState, useEffect, useMemo} from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, IconButton, CircularProgress, Typography
    , FormControl, InputLabel, Select, MenuItem

} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {nodeApi} from '../services/api';
import dayjs from 'dayjs';
import 'react-diff-view/style/index.css';
import {WordDiff} from './WordDiff';
import Token from '../services/token';

export interface HistoryEntry {
    id: number;
    concept_id: number;
    modified_by: number;
    modified_at: string;
    field_modified: string;
    old_value: string;
    new_value: string;
    version_number: number;
    global_version: number;
    is_rollback: boolean;
    note?: string;
}

interface VersionGroup {
    versionNumber: number;
    globalVersion: number;
    modifiedBy: number;
    modifiedAt: string;
    entries: HistoryEntry[];
}

interface HistoryModalProps {
    conceptId: string;
    open: boolean;
    onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
                                                              conceptId, open, onClose
                                                          }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');

    // Filtre sur les rollbacks
    type RollbackFilter = 'Tous types' | 'Rollbacks' | 'Sans rollbacks';
    const [selectedRollbackFilter, setSelectedRollbackFilter] = useState<RollbackFilter>('Tous types');


    const [catIdx, setCatIdx] = useState(0);

    const [rollbackLoading, setRollbackLoading] = useState(false);
    const [rollbackError, setRollbackError] = useState<string | null>(null);


    // Regrouper par version_number
    const versions: VersionGroup[] = useMemo(() => {
        const map = new Map<number, VersionGroup>();
        history.forEach(h => {
            if (!map.has(h.version_number)) {
                map.set(h.version_number, {
                    versionNumber: h.version_number,
                    globalVersion: h.global_version,
                    modifiedBy: h.modified_by,
                    modifiedAt: h.modified_at,
                    entries: []
                });
            }
            map.get(h.version_number)!.entries.push(h);
        });
        return Array.from(map.values())
            .sort((a, b) => a.globalVersion - b.globalVersion);
    }, [history]);

    // liste des catégories (field_modified)
    const categories = useMemo(
        () => ['Toutes', ...Array.from(new Set(history.map(h => h.field_modified)))],
        [history]
    );

    // versions filtrées selon la catégorie et le filtre rollback
    const filteredVersions = useMemo(() => {
        return versions
            .map(v => {
                // 1) filtrage par catégorie
                let entries = selectedCategory === 'Toutes'
                    ? v.entries
                    : v.entries.filter(e => e.field_modified === selectedCategory);
                // 2) filtrage par rollback
                if (selectedRollbackFilter === 'Rollbacks') {
                    entries = entries.filter(e => e.is_rollback);
                } else if (selectedRollbackFilter === 'Sans rollbacks') {
                    entries = entries.filter(e => !e.is_rollback);
                }
                return {...v, entries};
            })
            // on ne garde que les versions où il reste au moins une entrée
            .filter(v => v.entries.length > 0);

    }, [versions, selectedCategory]);

    // réinitialiser l'index lors du changement de filtre
    useEffect(() => {
        if (filteredVersions.length > 0) {
            setCatIdx(filteredVersions.length - 1);
        }
    }, [filteredVersions]);


    useEffect(() => {
        if (!open) return;
        setLoading(true);
        nodeApi.getConceptHistory(conceptId)
            .then(list => setHistory(list))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [open, conceptId]);

    useEffect(() => {
        if (versions.length > 0) {
            setCurrentIdx(versions.length - 1);
        }
    }, [versions]);

    const handleRollback = async () => {
        if (!current || selectedCategory === 'Toutes') return;
        const username = Token.getUsernameFromToken();
        if (!username) {
            setRollbackError("Utilisateur non authentifié");
            return;
        }

        setRollbackError(null);
        setRollbackLoading(true);
        try {
            await nodeApi.rollbackConcept(conceptId, {
                version_number: current.versionNumber,
                field_modified: selectedCategory,
                username
            });
            // Optionnel : message utilisateur
            alert('Rollback effectué avec succès sur la catégorie « ' + selectedCategory + ' »');
            // Rafraîchir l'historique
            const fresh = await nodeApi.getConceptHistory(conceptId);
            setHistory(fresh);
        } catch (e: any) {
            setRollbackError(e.message || 'Erreur inattendue');
        } finally {
            setRollbackLoading(false);
        }
    };

    const current = filteredVersions[catIdx];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                Historique des modifications
                <IconButton
                    edge="end" onClick={onClose} style={{position: 'absolute', right: 8, top: 8}}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers style={{minHeight: 200}}>
                {loading && <CircularProgress/>}
                {error && <Typography color="error">{error}</Typography>}
                {!loading && !error && versions.length === 0 &&
                    <Typography>Aucune modification enregistrée.</Typography>
                }
                {!loading && !error && filteredVersions.length > 0 && current && (
                    <>
                        {/* Barre de filtres */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                          <FormControl variant="standard" size="small" style={{ minWidth: 180 }}>
                            <InputLabel>Type d'entrée</InputLabel>
                            <Select
                              value={selectedRollbackFilter}
                              onChange={e => setSelectedRollbackFilter(e.target.value as RollbackFilter)}
                              label="Type d'entrée"
                            >
                              <MenuItem value="Tous types">Tous types</MenuItem>
                              <MenuItem value="Rollbacks">Rollbacks</MenuItem>
                              <MenuItem value="Sans rollbacks">Sans rollbacks</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl variant="standard" size="small" style={{ minWidth: 200 }}>
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                              value={selectedCategory}
                              onChange={e => setSelectedCategory(e.target.value)}
                              label="Catégorie"
                            >
                              {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>
                                  {cat}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <Typography variant="subtitle1" gutterBottom>
                            Version #{current.versionNumber}
                            (global {current.globalVersion}) — Modifié par #{current.modifiedBy} le{' '}
                            {dayjs(current.modifiedAt).format('YYYY-MM-DD HH:mm')}
                        </Typography>
                        {current.entries
                            .filter(e => selectedCategory === "Toutes" || e.field_modified === selectedCategory)
                            .map((entry, i) => {
                                return (
                                    <div key={i} style={{marginBottom: 24}}>
                                        <Typography variant="body2" gutterBottom>
                                            Champ modifié : <strong>{entry.field_modified}</strong>
                                        </Typography>
                                        <WordDiff
                                            oldText={entry.old_value || ''}
                                            newText={entry.new_value || ''}
                                        />
                                        {entry.note && (
                                            <Typography variant="caption">
                                                Note: {entry.note}
                                            </Typography>
                                        )}
                                    </div>
                                );
                            })}
                    </>
                )}
            </DialogContent>
            {filteredVersions.length > 0 && (
                <DialogActions>
                    {selectedCategory !== 'Toutes' && (
                        <Button
                            color="secondary"
                            onClick={handleRollback}
                            disabled={rollbackLoading}
                        >
                            {rollbackLoading ? 'Rollback...' : 'Rollback catégorie'}
                        </Button>
                    )}
                    {rollbackError && (
                        <Typography color="error" variant="body2" style={{marginLeft: 16}}>
                            {rollbackError}
                        </Typography>
                    )}

                    <Button
                        onClick={() => setCatIdx(idx => Math.max(0, idx - 1))}
                        disabled={catIdx === 0}
                    >
                        Précédent
                    </Button>
                    <Button
                        onClick={() => setCatIdx(idx => Math.min(filteredVersions.length - 1, idx + 1))}
                        disabled={catIdx === filteredVersions.length - 1}
                    >
                        Suivant
                    </Button>

                </DialogActions>
            )}
        </Dialog>
    );
};