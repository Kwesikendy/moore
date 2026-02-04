import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers, deleteMember, logout } from '../services/api';
import Analytics from '../components/Analytics';
import MemberTable from '../components/MemberTable';
import '../styles/Dashboard.css';

export default function Dashboard() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('members');
    const navigate = useNavigate();

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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;

        try {
            await deleteMember(id);
            setMembers(members.filter((m) => m.id !== id));
        } catch (error) {
            alert('Failed to delete member');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const exportToCSV = () => {
        const headers = [
            'First Name',
            'Last Name',
            'DOB',
            'Gender',
            'Phone',
            'Address',
            'Baptized',
            'Water Baptized',
            'Holy Ghost Baptized',
            'Presiding Elder',
            'Working',
            'Occupation',
            'Marital Status',
            'Children',
            'Ministry',
            'Joined Date',
            'Prayer Requests',
        ];

        const rows = members.map((m) => [
            m.firstName,
            m.lastName,
            m.dob || '',
            m.gender || '',
            m.phone || '',
            m.address || '',
            m.baptized ? 'Yes' : 'No',
            m.waterBaptized ? 'Yes' : 'No',
            m.holyGhostBaptized ? 'Yes' : 'No',
            m.presidingElder || '',
            m.working ? 'Yes' : 'No',
            m.occupation || '',
            m.maritalStatus || '',
            m.childrenCount || '',
            m.ministry || '',
            m.joinedDate || '',
            m.prayerRequests || '',
        ]);

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');

        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `church_members_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Church Admin Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>

            <div className="dashboard-tabs">
                <button
                    className={`tab ${activeTab === 'members' ? 'active' : ''}`}
                    onClick={() => setActiveTab('members')}
                >
                    Members
                </button>
                <button
                    className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics
                </button>
                <button
                    className={`tab ${activeTab === 'form-builder' ? 'active' : ''}`}
                    onClick={() => setActiveTab('form-builder')}
                >
                    Form Builder
                </button>
            </div>

            <div className="dashboard-content">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'members' && (
                            <div>
                                <div className="members-header">
                                    <h2>All Members ({members.length})</h2>
                                    <button onClick={exportToCSV} className="export-button">
                                        Export to CSV
                                    </button>
                                </div>
                                <MemberTable members={members} onDelete={handleDelete} />
                            </div>
                        )}

                        {activeTab === 'analytics' && <Analytics members={members} />}

                        {activeTab === 'form-builder' && (
                            <div className="form-builder-placeholder">
                                <h2>Form Builder</h2>
                                <p>Form builder interface coming soon...</p>
                                <p>
                                    This will allow you to add/remove fields, set field types, and define conditional
                                    logic.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
