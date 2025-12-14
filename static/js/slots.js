// slots.js
let editingSlot = null;

document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    if (!isAdmin()) { window.location.href = 'dashboard.html'; return; }
    initSettings();
    loadSlots();
    loadAvailableSlots();
});

async function loadSlots() {
    const data = await apiCall('/api/slots');
    if (data && data.success) displaySlotsList(data.data);
}

async function loadAvailableSlots() {
    const data = await apiCall('/api/slots/available');
    if (data && data.success) {
        const select = document.getElementById('slot-number');
        if (select) select.innerHTML = data.data.map(n => `<option value="${n}">Slot ${n}</option>`).join('');
    }
}

function displaySlotsList(slots) {
    const tbody = document.getElementById('slots-tbody');
    if (!slots || slots.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Chưa có slot nào</td></tr>';
        return;
    }
    const types = { value: 'Giá trị', status: 'Trạng thái', control: 'Điều khiển', camera: 'Camera', chart: 'Biểu đồ' };
    tbody.innerHTML = slots.map(s => {
        let alertInfo = '-';
        if (s.alert_enabled && (s.alert_min !== null || s.alert_max !== null)) {
            const min = s.alert_min !== null ? `↓${s.alert_min}` : '';
            const max = s.alert_max !== null ? `↑${s.alert_max}` : '';
            alertInfo = `<span class="badge badge-alert">⚠️ ${min} ${max}</span>`;
        }
        return `<tr>
            <td><span class="badge badge-slot">${s.slot_number}</span></td>
            <td>${s.icon || '📟'} ${s.name}</td>
            <td><span class="badge badge-${s.type}">${types[s.type] || s.type}</span></td>
            <td>${s.unit || '-'}</td>
            <td>${alertInfo}</td>
            <td>${s.location || '-'}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editSlot(${s.slot_number})">✏️</button>
                <button class="btn btn-sm btn-delete" onclick="deleteSlot(${s.slot_number})">🗑️</button>
            </td>
        </tr>`;
    }).join('');
}

function showAddForm() {
    editingSlot = null;
    document.getElementById('form-title').textContent = 'Thêm Slot';
    document.getElementById('slot-form').reset();
    document.getElementById('slot-number').disabled = false;
    document.getElementById('alert-enabled').checked = false;
    document.getElementById('alert-min').value = '';
    document.getElementById('alert-max').value = '';
    loadAvailableSlots();
    onTypeChange();
    onAlertToggle();
    document.getElementById('slot-modal').style.display = 'flex';
}

async function editSlot(num) {
    const data = await apiCall(`/api/slots/${num}`);
    if (!data || !data.success) return;
    const slot = data.data;
    editingSlot = num;
    document.getElementById('form-title').textContent = `Sửa Slot ${num}`;
    document.getElementById('slot-number').innerHTML = `<option value="${num}">Slot ${num}</option>`;
    document.getElementById('slot-number').value = num;
    document.getElementById('slot-number').disabled = true;
    document.getElementById('slot-name').value = slot.name || '';
    document.getElementById('slot-type').value = slot.type || 'value';
    document.getElementById('slot-icon').value = slot.icon || '';
    document.getElementById('slot-unit').value = slot.unit || '';
    document.getElementById('slot-location').value = slot.location || '';
    document.getElementById('slot-stream-url').value = slot.stream_url || '';
    
    // Alert settings
    document.getElementById('alert-enabled').checked = slot.alert_enabled == 1;
    document.getElementById('alert-min').value = slot.alert_min !== null ? slot.alert_min : '';
    document.getElementById('alert-max').value = slot.alert_max !== null ? slot.alert_max : '';
    
    onTypeChange();
    onAlertToggle();
    document.getElementById('slot-modal').style.display = 'flex';
}

function onTypeChange() {
    const type = document.getElementById('slot-type').value;
    const showUnit = type === 'value' || type === 'chart';
    document.getElementById('unit-group').style.display = showUnit ? 'block' : 'none';
    document.getElementById('stream-group').style.display = type === 'camera' ? 'block' : 'none';
    document.getElementById('alert-group').style.display = showUnit ? 'block' : 'none';
    
    if (!showUnit) {
        document.getElementById('alert-enabled').checked = false;
        onAlertToggle();
    }
}

function onAlertToggle() {
    const enabled = document.getElementById('alert-enabled').checked;
    document.getElementById('alert-thresholds').style.display = enabled ? 'block' : 'none';
}

function hideModal() { document.getElementById('slot-modal').style.display = 'none'; }

async function submitSlotForm(e) {
    e.preventDefault();
    
    const alertMin = document.getElementById('alert-min').value;
    const alertMax = document.getElementById('alert-max').value;
    
    const data = {
        slot_number: parseInt(document.getElementById('slot-number').value),
        name: document.getElementById('slot-name').value.trim(),
        type: document.getElementById('slot-type').value,
        icon: document.getElementById('slot-icon').value.trim() || '📟',
        unit: document.getElementById('slot-unit').value.trim(),
        location: document.getElementById('slot-location').value.trim(),
        stream_url: document.getElementById('slot-stream-url').value.trim(),
        alert_enabled: document.getElementById('alert-enabled').checked,
        alert_min: alertMin !== '' ? parseFloat(alertMin) : null,
        alert_max: alertMax !== '' ? parseFloat(alertMax) : null
    };
    
    if (!data.name) { showError('Nhập tên slot!'); return; }
    
    // Validate alert thresholds
    if (data.alert_enabled) {
        if (data.alert_min === null && data.alert_max === null) {
            showError('Vui lòng nhập ít nhất một ngưỡng cảnh báo!');
            return;
        }
        if (data.alert_min !== null && data.alert_max !== null && data.alert_min >= data.alert_max) {
            showError('Ngưỡng thấp phải nhỏ hơn ngưỡng cao!');
            return;
        }
    }
    
    const res = editingSlot 
        ? await apiCall(`/api/slots/${editingSlot}`, 'PUT', data)
        : await apiCall('/api/slots', 'POST', data);
    if (res && res.success) {
        showSuccess(editingSlot ? 'Đã cập nhật!' : 'Đã tạo slot!');
        hideModal(); loadSlots(); loadAvailableSlots();
    } else showError(res?.error || 'Có lỗi!');
}

async function deleteSlot(num) {
    if (!confirm(`Xóa Slot ${num}?`)) return;
    const res = await apiCall(`/api/slots/${num}`, 'DELETE');
    if (res && res.success) { showSuccess('Đã xóa!'); loadSlots(); loadAvailableSlots(); }
}
