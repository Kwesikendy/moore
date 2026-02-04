import { useState } from 'react';
import '../styles/MemberTable.css';

export default function MemberTable({ members, onDelete }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('');

    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone?.includes(searchTerm);

        const matchesGender = !filterGender || member.gender === filterGender;

        return matchesSearch && matchesGender;
    });

    return (
        <div className="member-table-container">
            <div className="table-filters">
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="table-wrapper">
                <table className="member-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Baptized</th>
                            <th>Ministry</th>
                            <th>Working</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    No members found
                                </td>
                            </tr>
                        ) : (
                            filteredMembers.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        {member.firstName} {member.lastName}
                                    </td>
                                    <td>{member.gender || '-'}</td>
                                    <td>{member.phone || '-'}</td>
                                    <td>
                                        <span className={`badge ${member.baptized ? 'badge-yes' : 'badge-no'}`}>
                                            {member.baptized ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>{member.ministry || '-'}</td>
                                    <td>
                                        <span className={`badge ${member.working ? 'badge-yes' : 'badge-no'}`}>
                                            {member.working ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => onDelete(member.id)} className="delete-button">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                Showing {filteredMembers.length} of {members.length} members
            </div>
        </div>
    );
}
