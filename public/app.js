// API 基础 URL
const API_URL = 'http://localhost:3000/api/notes';

// 当前编辑的笔记 ID
let currentNoteId = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadAllNotes();
});

// 加载所有笔记
async function loadAllNotes() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result.success) {
            displayNotes(result.data);
            updateNotesCount(result.data.length);
        } else {
            showMessage('加载笔记失败', 'error');
        }
    } catch (error) {
        console.error('错误:', error);
        showMessage('无法连接到服务器', 'error');
    }
}

// 显示笔记列表
function displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                </svg>
                <p>还没有笔记<br>开始创建第一条笔记吧！</p>
            </div>
        `;
        return;
    }

    notes.forEach(note => {
        const li = document.createElement('li');
        li.className = 'note-item';
        if (note.id === currentNoteId) {
            li.classList.add('active');
        }

        const preview = note.content.length > 100 
            ? note.content.substring(0, 100) + '...' 
            : note.content;

        const date = new Date(note.updatedAt).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        li.innerHTML = `
            <div class="note-title">${escapeHtml(note.title)}</div>
            <div class="note-preview">${escapeHtml(preview)}</div>
            <div class="note-meta">
                <div class="note-date">${date}</div>
                <div class="note-actions">
                    <button class="btn-small btn-load" onclick="loadNote(${note.id})">📖 加载</button>
                    <button class="btn-small btn-delete" onclick="deleteNote(${note.id})">❌ 删除</button>
                </div>
            </div>
        `;

        notesList.appendChild(li);
    });
}

// 保存笔记（新建或更新）
async function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (!title) {
        showMessage('请输入笔记标题', 'error');
        return;
    }

    if (!content) {
        showMessage('请输入笔记内容', 'error');
        return;
    }

    try {
        let response;
        if (currentNoteId) {
            // 更新现有笔记
            response = await fetch(`${API_URL}/${currentNoteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
        } else {
            // 创建新笔记
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
        }

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            currentNoteId = result.data.id;
            await loadAllNotes();
            updateEditorTitle(currentNoteId ? '编辑笔记' : '新建笔记');
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('错误:', error);
        showMessage('保存失败，请检查服务器连接', 'error');
    }
}

// 加载单个笔记到编辑器
async function loadNote(noteId) {
    try {
        const response = await fetch(`${API_URL}/${noteId}`);
        const result = await response.json();

        if (result.success) {
            const note = result.data;
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            currentNoteId = note.id;
            updateEditorTitle('编辑笔记');
            await loadAllNotes(); // 刷新列表以更新活动状态
        } else {
            showMessage('加载笔记失败', 'error');
        }
    } catch (error) {
        console.error('错误:', error);
        showMessage('加载失败', 'error');
    }
}

// 删除笔记
async function deleteNote(noteId) {
    if (!confirm('确定要删除这条笔记吗？')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${noteId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            
            // 如果删除的是当前编辑的笔记，清空编辑器
            if (currentNoteId === noteId) {
                newNote();
            }
            
            await loadAllNotes();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('错误:', error);
        showMessage('删除失败', 'error');
    }
}

// 新建笔记
function newNote() {
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    currentNoteId = null;
    updateEditorTitle('新建笔记');
    loadAllNotes(); // 刷新列表以移除活动状态
}

// 清空编辑器
function clearEditor() {
    if (confirm('确定要清空当前内容吗？')) {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
    }
}

// 搜索笔记
async function searchNotes() {
    const keyword = document.getElementById('searchInput').value.trim();
    
    if (!keyword) {
        loadAllNotes();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search/${encodeURIComponent(keyword)}`);
        const result = await response.json();

        if (result.success) {
            displayNotes(result.data);
            updateNotesCount(result.count);
            showMessage(`找到 ${result.count} 条相关笔记`, 'success');
        } else {
            showMessage('搜索失败', 'error');
        }
    } catch (error) {
        console.error('错误:', error);
        showMessage('搜索失败', 'error');
    }
}

// 更新编辑器标题
function updateEditorTitle(title) {
    document.getElementById('editorTitle').textContent = title;
}

// 更新笔记计数
function updateNotesCount(count) {
    document.getElementById('notesCount').textContent = count;
}

// 显示加载状态
function showLoading() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '<div class="loading">加载中...</div>';
}

// 显示消息
function showMessage(message, type = 'success') {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type} show`;

    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 3000);
}

// HTML 转义函数，防止 XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 监听搜索框回车键
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchNotes();
            }
        });

        // 清空搜索框时重新加载所有笔记
        searchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                loadAllNotes();
            }
        });
    }
});
