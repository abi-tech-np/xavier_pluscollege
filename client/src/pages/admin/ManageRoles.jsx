import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ACTIONS = [
    'force_delete_any', 'force_delete', 'delete_any', 'delete', 
    'restore_any', 'restore', 'view_any', 'view', 
    'create', 'update', 'replicate', 'reorder'
];

function parsePermission(name) {
    let action = 'Other';
    let resource = name;
    
    for (let a of ACTIONS) {
        if (name.startsWith(a + '_')) {
            action = a;
            const rest = name.substring(a.length + 1);
            if (rest.includes('::')) {
                // The string is usually duplicated like apply::apply
                resource = rest.substring(0, Math.floor(rest.length / 2));
                if (resource.endsWith(':')) resource = resource.slice(0, -1);
            } else {
                resource = rest;
            }
            break;
        }
    }
    
    const formattedAction = action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const formattedResource = resource.replace(/::/g, ' ').split(/[-_ ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    return { action: formattedAction, resource: formattedResource, original: name };
}

const ManageRoles = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [groupedPermissions, setGroupedPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [name, setName] = useState('');
    const [guardName, setGuardName] = useState('web');
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // UI state
    const [openCards, setOpenCards] = useState({});

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    const fetchData = async () => {
        try {
            const [rolesRes, permsRes] = await Promise.all([
                axios.get('https://plus.xavier.edu.np/plus-api/api/admin/roles', getAuthHeaders()),
                axios.get('https://plus.xavier.edu.np/plus-api/api/admin/permissions', getAuthHeaders())
            ]);
            setRoles(rolesRes.data);
            
            const perms = permsRes.data;
            setPermissions(perms);
            
            const grouped = {};
            const initialOpen = {};
            perms.forEach(p => {
                const parsed = parsePermission(p.name);
                if (!grouped[parsed.resource]) {
                    grouped[parsed.resource] = [];
                    initialOpen[parsed.resource] = true;
                }
                grouped[parsed.resource].push({ ...p, parsed });
            });
            setGroupedPermissions(grouped);
            setOpenCards(initialOpen);
            
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleCard = (resource) => {
        setOpenCards(prev => ({ ...prev, [resource]: !prev[resource] }));
    };

    const handleCheckboxChange = (id) => {
        setSelectedPermissions(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSelectAllResource = (resource) => {
        const resourcePerms = groupedPermissions[resource].map(p => p.id);
        const allSelected = resourcePerms.every(id => selectedPermissions.includes(id));
        
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !resourcePerms.includes(id)));
        } else {
            const newSelection = new Set([...selectedPermissions, ...resourcePerms]);
            setSelectedPermissions(Array.from(newSelection));
        }
    };

    const handleGlobalSelectAll = () => {
        if (selectedPermissions.length === permissions.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(permissions.map(p => p.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://plus.xavier.edu.np/plus-api/api/admin/roles', { 
                name, 
                guard_name: guardName,
                permissions: selectedPermissions 
            }, getAuthHeaders());
            setName('');
            setGuardName('web');
            setSelectedPermissions([]);
            fetchData();
        } catch (error) {
            console.error('Failed to save', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await axios.delete(`https://plus.xavier.edu.np/plus-api/api/admin/roles/${id}`, getAuthHeaders());
                fetchData();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fafafa', marginBottom: '1.5rem' }}>Create Role</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label style={{ color: '#fafafa', fontWeight: 500 }}>Name <span style={{color: '#ef4444'}}>*</span></label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                style={{ backgroundColor: '#171717', border: '1px solid #262626', color: '#fafafa', padding: '0.75rem', borderRadius: '0.375rem', width: '100%', outline: 'none' }} 
                            />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label style={{ color: '#fafafa', fontWeight: 500 }}>Guard Name</label>
                            <input 
                                type="text" 
                                value={guardName} 
                                onChange={(e) => setGuardName(e.target.value)} 
                                required 
                                style={{ backgroundColor: '#171717', border: '1px solid #262626', color: '#fafafa', padding: '0.75rem', borderRadius: '0.375rem', width: '100%', outline: 'none' }} 
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fafafa', fontWeight: 500 }}>
                                <input 
                                    type="checkbox" 
                                    checked={permissions.length > 0 && selectedPermissions.length === permissions.length}
                                    onChange={handleGlobalSelectAll}
                                    style={{ transform: 'scale(1.2)' }}
                                />
                                Select All
                            </label>
                            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Enable all Permissions currently Enabled for this role</span>
                        </div>
                    </div>
                </div>

                <div className="admin-card" style={{ padding: '0', backgroundColor: 'transparent', border: 'none' }}>
                    <div style={{ backgroundColor: '#171717', borderRadius: '0.5rem', border: '1px solid #262626', overflow: 'hidden' }}>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem 1.5rem', borderBottom: '1px solid #262626' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 500 }}>
                                Resources <span style={{ backgroundColor: '#422006', color: '#fbbf24', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{Object.keys(groupedPermissions).length}</span>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Object.keys(groupedPermissions).map(resource => {
                                const perms = groupedPermissions[resource];
                                const isOpen = openCards[resource];
                                const isAllSelected = perms.every(p => selectedPermissions.includes(p.id));

                                return (
                                    <div key={resource} style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                        <div 
                                            onClick={() => toggleCard(resource)}
                                            style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: isOpen ? '1px solid #262626' : 'none' }}
                                        >
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fafafa' }}>{resource}</h3>
                                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>App\Models\{resource.replace(/\s+/g, '')}</span>
                                            </div>
                                            <div style={{ color: '#71717a' }}>
                                                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </div>
                                        
                                        {isOpen && (
                                            <div style={{ padding: '1.5rem' }}>
                                                <div 
                                                    onClick={() => handleSelectAllResource(resource)}
                                                    style={{ color: '#fbbf24', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem', display: 'inline-block' }}
                                                >
                                                    Select all
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                                    {perms.map(p => (
                                                        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#d4d4d8', fontSize: '0.875rem' }}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedPermissions.includes(p.id)}
                                                                onChange={() => handleCheckboxChange(p.id)}
                                                                style={{ transform: 'scale(1.1)', accentColor: '#fbbf24' }}
                                                            />
                                                            {p.parsed.action}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="admin-btn" style={{ backgroundColor: '#fbbf24', color: '#000', fontWeight: 600, padding: '0.75rem 2rem' }}>Create</button>
                </div>
            </form>

            <div className="admin-card" style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fafafa', marginBottom: '1.5rem' }}>Existing Roles</h3>
                {loading ? <p>Loading...</p> : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Role Name</th>
                                    <th>Guard</th>
                                    <th>Permissions Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ color: '#fafafa', fontWeight: '500' }}>{item.name}</td>
                                        <td>{item.guard_name}</td>
                                        <td>
                                            <span className="admin-badge badge-success">
                                                {item.role_has_permissions?.length || 0} permissions
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(item.id)} className="admin-btn admin-btn-danger" style={{ padding: '0.3rem 0.6rem' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {roles.length === 0 && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No roles found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageRoles;
