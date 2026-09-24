const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 模拟数据库 (使用内存存储)
let notes = [];
let nextId = 1;

// 根路由 - 提供前端页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API 路由

// 获取所有笔记
app.get('/api/notes', (req, res) => {
    res.json({
        success: true,
        data: notes
    });
});

// 获取单个笔记
app.get('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find(n => n.id === id);
    
    if (note) {
        res.json({
            success: true,
            data: note
        });
    } else {
        res.status(404).json({
            success: false,
            message: '笔记未找到'
        });
    }
});

// 创建新笔记
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: '标题和内容不能为空'
        });
    }
    
    const newNote = {
        id: nextId++,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    notes.unshift(newNote);
    
    res.status(201).json({
        success: true,
        data: newNote,
        message: '笔记创建成功'
    });
});

// 更新笔记
app.put('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '笔记未找到'
        });
    }
    
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: '标题和内容不能为空'
        });
    }
    
    notes[noteIndex] = {
        ...notes[noteIndex],
        title,
        content,
        updatedAt: new Date().toISOString()
    };
    
    res.json({
        success: true,
        data: notes[noteIndex],
        message: '笔记更新成功'
    });
});

// 删除笔记
app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '笔记未找到'
        });
    }
    
    notes.splice(noteIndex, 1);
    
    res.json({
        success: true,
        message: '笔记删除成功'
    });
});

// 搜索笔记
app.get('/api/notes/search/:keyword', (req, res) => {
    const keyword = req.params.keyword.toLowerCase();
    const results = notes.filter(note => 
        note.title.toLowerCase().includes(keyword) || 
        note.content.toLowerCase().includes(keyword)
    );
    
    res.json({
        success: true,
        data: results,
        count: results.length
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`✅ NoteTaker 服务器运行在 http://localhost:${PORT}`);
    console.log(`📝 API 端点: http://localhost:${PORT}/api/notes`);
});
