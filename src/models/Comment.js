const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  tmdbId: { 
    type: Number, 
    required: true 
  },
  mediaType: { 
    type: String, 
    required: true, 
    enum: ['movie', 'tv'] 
  },
  text: { 
    type: String, 
    required: true, 
    maxlength: 500 
  }
}, { timestamps: true });

// Índice composto para otimizar consultas por tmdbId e mediaType
commentSchema.index({ tmdbId: 1, mediaType: 1 });

// Índice para otimizar consultas por usuário
commentSchema.index({ userId: 1 });

module.exports = mongoose.model('Comment', commentSchema); 