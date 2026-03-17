const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const getFilePath = (collection) => path.join(dataDir, `${collection}.json`);

const readData = (collection) => {
    const filePath = getFilePath(collection);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeData = (collection, data) => {
    const filePath = getFilePath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const db = {
    get: (collection, query = {}) => {
        const data = readData(collection);
        return data.filter(item => {
            for (let key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });
    },

    findOne: (collection, query) => {
        const data = db.get(collection, query);
        return data.length > 0 ? data[0] : null;
    },

    findById: (collection, id) => {
        return db.findOne(collection, { id });
    },

    insert: (collection, item) => {
        const data = readData(collection);
        const newItem = {
            ...item,
            id: uuidv4(),
            _id: uuidv4(), // mapping for frontend
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.push(newItem);
        writeData(collection, data);
        return newItem;
    },

    updateById: (collection, id, updates) => {
        const data = readData(collection);
        const index = data.findIndex(item => item.id === id || item._id === id);
        if (index === -1) return null;

        data[index] = {
            ...data[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        writeData(collection, data);
        return data[index];
    },

    deleteById: (collection, id) => {
        const data = readData(collection);
        const filtered = data.filter(item => item.id !== id && item._id !== id);
        if (filtered.length === data.length) return false;

        writeData(collection, filtered);
        return true;
    }
};

module.exports = db;
