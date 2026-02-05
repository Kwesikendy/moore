import { useState, useEffect } from 'react';
import { getMembers } from '../services/api';
import Analytics from '../components/Analytics';

export default function Dashboard() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const data = await getMembers();
            setMembers(data);
        } catch (error) {
            console.error('Error loading members:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Overview</h1>
                    <p className="page-subtitle">Church growth and statistics</p>
                </div>
            </div>

            {loading ? (
                <div>Loading stats...</div>
            ) : (
                <Analytics members={members} />
            )}
        </div>
    );
}
