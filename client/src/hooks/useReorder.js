import { useState } from 'react';
import axios from 'axios';
import { getApiUrl, clearApiCache } from '../services/apiClient';

/**
 * Custom hook to handle HTML5 native drag-and-drop & manual priority order control.
 * Persists the reordered list in a single bulk-update call to /api/admin/reorder.
 */
export function useReorder({ entity, items, setItems, onNotify, getAuthHeaders }) {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [isReordering, setIsReordering] = useState(false);

    const persistOrder = async (newItems, previousItems) => {
        setIsReordering(true);
        try {
            const payload = {
                entity,
                items: newItems.map((item, idx) => ({ id: item.id, display_order: idx }))
            };
            const headers = getAuthHeaders ? getAuthHeaders() : {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            };
            await axios.put(getApiUrl('/admin/reorder'), payload, headers);
            clearApiCache();
            if (onNotify) {
                onNotify('Display order updated successfully!', 'success');
            }
        } catch (error) {
            console.error('Failed to update display order:', error);
            if (onNotify) {
                onNotify(error.response?.data?.error || 'Failed to update display order.', 'error');
            }
            // Revert state on failure
            if (previousItems) {
                setItems(previousItems);
            }
        } finally {
            setIsReordering(false);
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        setDragOverIndex(null);
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const previousItems = [...items];
        const updated = [...items];
        const [movedItem] = updated.splice(draggedIndex, 1);
        updated.splice(dropIndex, 0, movedItem);

        const withNewOrders = updated.map((it, idx) => ({ ...it, display_order: idx }));
        setItems(withNewOrders);
        setDraggedIndex(null);
        persistOrder(withNewOrders, previousItems);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const moveItem = (index, direction) => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const previousItems = [...items];
        const updated = [...items];
        const [movedItem] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, movedItem);

        const withNewOrders = updated.map((it, idx) => ({ ...it, display_order: idx }));
        setItems(withNewOrders);
        persistOrder(withNewOrders, previousItems);
    };

    const updateItemOrder = (currentIndex, targetOrderNumber) => {
        const targetIndex = Math.max(0, Math.min(items.length - 1, parseInt(targetOrderNumber, 10) - 1));
        if (isNaN(targetIndex) || targetIndex === currentIndex) return;

        const previousItems = [...items];
        const updated = [...items];
        const [movedItem] = updated.splice(currentIndex, 1);
        updated.splice(targetIndex, 0, movedItem);

        const withNewOrders = updated.map((it, idx) => ({ ...it, display_order: idx }));
        setItems(withNewOrders);
        persistOrder(withNewOrders, previousItems);
    };

    return {
        draggedIndex,
        dragOverIndex,
        isReordering,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        moveItem,
        updateItemOrder
    };
}
