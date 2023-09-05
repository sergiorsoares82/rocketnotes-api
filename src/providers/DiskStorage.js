const fs = require('fs');
const path = require('path');
const uploadConfig = require('../configs/uploads');
const AppError = require('../utils/AppError');

class DiskStorage {
  async saveFile(file) {
    try {
      await fs.promises.rename(
        path.resolve(uploadConfig.TMP_FOLDER, file),
        path.resolve(uploadConfig.UPLOADS_FOLDER, file)
      );
    } catch (error) {
      throw new AppError('Erro ao salvar imagem.', 500);
    }

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);
    try {
      await fs.promises.stat(filePath);
    } catch (error) {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
