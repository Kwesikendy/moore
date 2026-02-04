import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analytics.css';

const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

export default function Analytics({ members }) {
    // Gender distribution
    const genderData = [
        { name: 'Male', value: members.filter((m) => m.gender === 'Male').length },
        { name: 'Female', value: members.filter((m) => m.gender === 'Female').length },
        { name: 'Other', value: members.filter((m) => m.gender === 'Other').length },
    ].filter((d) => d.value > 0);

    // Baptism stats
    const baptismData = [
        { name: 'Baptized', value: members.filter((m) => m.baptized).length },
        { name: 'Water Baptized', value: members.filter((m) => m.waterBaptized).length },
        { name: 'Holy Ghost Baptized', value: members.filter((m) => m.holyGhostBaptized).length },
    ];

    // Ministry distribution
    const ministryCount = {};
    members.forEach((m) => {
        if (m.ministry) {
            ministryCount[m.ministry] = (ministryCount[m.ministry] || 0) + 1;
        }
    });
    const ministryData = Object.entries(ministryCount).map(([name, value]) => ({ name, value }));

    // Age distribution
    const ageGroups = {
        '0-18': 0,
        '19-30': 0,
        '31-50': 0,
        '51-70': 0,
        '70+': 0,
    };
    members.forEach((m) => {
        if (m.age) {
            if (m.age <= 18) ageGroups['0-18']++;
            else if (m.age <= 30) ageGroups['19-30']++;
            else if (m.age <= 50) ageGroups['31-50']++;
            else if (m.age <= 70) ageGroups['51-70']++;
            else ageGroups['70+']++;
        }
    });
    const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

    return (
        <div className="analytics-container">
            <h2>Analytics Dashboard</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Members</h3>
                    <p className="stat-value">{members.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Baptized</h3>
                    <p className="stat-value">{members.filter((m) => m.baptized).length}</p>
                </div>
                <div className="stat-card">
                    <h3>Working</h3>
                    <p className="stat-value">{members.filter((m) => m.working).length}</p>
                </div>
                <div className="stat-card">
                    <h3>Married</h3>
                    <p className="stat-value">{members.filter((m) => m.maritalStatus === 'Married').length}</p>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Gender Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Baptism Statistics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={baptismData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#1e3a8a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {ministryData.length > 0 && (
                    <div className="chart-card">
                        <h3>Ministry Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ministryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="chart-card">
                    <h3>Age Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#60a5fa" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
