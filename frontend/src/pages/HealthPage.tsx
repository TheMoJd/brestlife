import {useState, useEffect} from 'react';
import {healthCheck} from '../gen/openapi';

const HealthPage = () => {
    const [healthStatus, setHealthStatus] = useState<string>('Chargement...');

    useEffect(() => {
        const fetchHealthStatus = async () => {
            try {
                const {data} = await healthCheck();
                setHealthStatus(data ?? 'unknown');
            } catch (error) {
                console.error('Erreur lors de la vérification de la santé du serveur:', error);
                setHealthStatus('Indisponible');
            }
        };

        fetchHealthStatus();
    }, []);

    return (
        <div className="container">
            <h1>Statut du serveur</h1>
            <p>{healthStatus}</p>
        </div>
    );
};

export default HealthPage;