import React, { useState, useEffect } from 'react';
import { getMembers, deleteMember } from '../services/api';
import MemberTable from '../components/MemberTable';
import * as XLSX from 'xlsx';
import { Download, Search, RefreshCw } from 'lucide-react';

export default function Members() {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredMembers(members);
        } else {
            const lower = searchTerm.toLowerCase();
            const filtered = members.filter(m =>
                m.firstName.toLowerCase().includes(lower) ||
                m.lastName.toLowerCase().includes(lower) ||
                m.phone?.includes(searchTerm)
            );
            setFilteredMembers(filtered);
        }
    }, [searchTerm, members]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = await getMembers();
            setMembers(data);
            setFilteredMembers(data);
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

    const exportToExcel = () => {
        const dataToExport = members.map(m => ({
            'First Name': m.firstName,
            'Last Name': m.lastName,
            'DOB': m.dob,
            'Gender': m.gender,
            'Phone': m.phone,
            'Address': m.address,
            'Baptized': m.baptized ? 'Yes' : 'No',
            'Water Baptized': m.waterBaptized ? 'Yes' : 'No',
            'Holy Ghost Baptized': m.holyGhostBaptized ? 'Yes' : 'No',
            'Presiding Elder': m.presidingElder,
            'Working': m.working ? 'Yes' : 'No',
            'Occupation': m.occupation,
            'Marital Status': m.maritalStatus,
            'Children': m.childrenCount,
            'Ministry': m.ministry,
            'Joined Date': m.joinedDate,
            'Prayer Requests': m.prayerRequests
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Members");
        XLSX.writeFile(wb, `church_members_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Members Database</h1>
                    <p className="page-subtitle">Manage {members.length} registered members</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={loadMembers}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                    <button className="btn btn-primary" onClick={exportToExcel}>
                        <Download size={18} />
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '400px' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Loading members...</div>
                ) : (
                    <MemberTable members={filteredMembers} onDelete={handleDelete} />
                )}
            </div>
        </div>
    );
}
