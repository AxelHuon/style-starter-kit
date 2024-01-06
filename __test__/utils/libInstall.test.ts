import fs from 'fs';
import { installLibrary } from '../../lib/utils/libInstall';
import { exec } from 'child_process';

jest.mock('fs');
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('Tests for installLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use yarn to install the library if yarn.lock exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const mockExec = (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => {
      callback(null, 'Library installed successfully');
    });

    const libraryName = 'styled-components';
    installLibrary(libraryName);

    expect(fs.existsSync).toHaveBeenCalledWith('yarn.lock');
    expect(mockExec).toHaveBeenCalledWith(`yarn add ${libraryName}`, expect.any(Function));
  });

  it('should use npm to install the library if yarn.lock does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const mockExec = (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => {
      callback(null, 'Library installed successfully');
    });

    const libraryName = 'styled-components';
    installLibrary(libraryName);

    expect(fs.existsSync).toHaveBeenCalledWith('yarn.lock');
    expect(mockExec).toHaveBeenCalledWith(`npm install ${libraryName}`, expect.any(Function));
  });

  it('should handle errors during library installation', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const mockExec = (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => {
      callback(new Error('Installation error'), null);
    });

    const libraryName = 'styled-components';
    installLibrary(libraryName);

    expect(mockExec).toHaveBeenCalledWith(`npm install ${libraryName}`, expect.any(Function));
  });
});
