import { createDirectoryIfNeeded } from '../../lib/utils/folder';
import * as fs from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe('Tests for createDirectoryIfNeeded', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should create a directory if it does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const path = '/test/directory';
    createDirectoryIfNeeded(path);

    expect(fs.existsSync).toHaveBeenCalledWith(path);
    expect(fs.mkdirSync).toHaveBeenCalledWith(path, { recursive: true });
  });

  it('should not create a directory if it already exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const path = '/test/directory';
    const result = createDirectoryIfNeeded(path);

    expect(fs.existsSync).toHaveBeenCalledWith(path);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
