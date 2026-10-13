import React, { useState } from 'react';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

export const OrderControlCell = ({
    index,
    total,
    onMoveUp,
    onMoveDown,
    onUpdateOrder,
    disabled = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempOrder, setTempOrder] = useState(index + 1);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            if (onUpdateOrder) {
                onUpdateOrder(tempOrder);
            }
        } else if (e.key === 'Escape') {
            setTempOrder(index + 1);
            setIsEditing(false);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (tempOrder !== index + 1 && onUpdateOrder) {
            onUpdateOrder(tempOrder);
        }
    };

    return (
        <td data-label="Order" style={{ verticalAlign: 'middle', whiteSpace: 'nowrap', width: '110px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span
                    className="drag-handle"
                    title="Drag to reorder"
                    style={{ cursor: disabled ? 'not-allowed' : 'grab' }}
                >
                    <GripVertical size={16} />
                </span>

                {isEditing ? (
                    <input
                        type="number"
                        min="1"
                        max={total}
                        value={tempOrder}
                        onChange={(e) => setTempOrder(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                        style={{
                            width: '40px',
                            height: '24px',
                            padding: '0 4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textAlign: 'center',
                            backgroundColor: '#27272a',
                            color: '#fbbf24',
                            border: '1px solid #fbbf24',
                            borderRadius: '4px',
                            outline: 'none'
                        }}
                    />
                ) : (
                    <span
                        className="order-badge"
                        title="Click to manually edit priority number"
                        onClick={() => {
                            if (!disabled) {
                                setTempOrder(index + 1);
                                setIsEditing(true);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {index + 1}
                    </span>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <button
                        type="button"
                        className="order-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onMoveUp) onMoveUp();
                        }}
                        disabled={disabled || index === 0}
                        title="Move Up"
                        aria-label="Move Up"
                        style={{ height: '12px', padding: 0 }}
                    >
                        <ChevronUp size={11} />
                    </button>
                    <button
                        type="button"
                        className="order-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onMoveDown) onMoveDown();
                        }}
                        disabled={disabled || index === total - 1}
                        title="Move Down"
                        aria-label="Move Down"
                        style={{ height: '12px', padding: 0 }}
                    >
                        <ChevronDown size={11} />
                    </button>
                </div>
            </div>
        </td>
    );
};

export default OrderControlCell;
