import fs from 'fs';
import path from 'path';
import { ConfigInterface, loadConfig, writeConfigFile } from '../../lib/utils/configFile';

jest.mock('fs');
jest.mock('path');

describe('Tests for writeConfigFile', () => {
  const mockCwd = '/mocked/directory';
  const mockConfigPath = '/mocked/directory/style-starter-kit.config.json';

  beforeEach(() => {
    (process.cwd as jest.Mock) = jest.fn(() => mockCwd);
    (path.join as jest.Mock) = jest.fn(() => mockConfigPath);
    (fs.existsSync as jest.Mock).mockClear();
    (fs.readFileSync as jest.Mock).mockClear();
    (fs.writeFileSync as jest.Mock).mockClear();
  });

  it('should create a new config file if not existing', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    writeConfigFile('language', 'TypeScript');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockConfigPath,
      JSON.stringify({ language: 'TypeScript' }, null, 2),
      { encoding: 'utf8' },
    );
  });

  it('should update the config file if it exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ language: 'JavaScript' }));
    writeConfigFile('framework', 'nextjs');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockConfigPath,
      JSON.stringify({ language: 'JavaScript', framework: 'nextjs' }, null, 2),
      { encoding: 'utf8' },
    );
  });
});

describe('Tests for loadConfig', () => {
  const mockCwd = '/mocked/directory';
  const mockConfigPath = '/mocked/directory/style-starter-kit.config.json';

  beforeEach(() => {
    (process.cwd as jest.Mock) = jest.fn(() => mockCwd);
    (path.join as jest.Mock) = jest.fn(() => mockConfigPath);
    (fs.existsSync as jest.Mock).mockClear();
    (fs.readFileSync as jest.Mock).mockClear();
  });

  it('should load the configuration correctly', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify({ language: 'TypeScript', framework: 'nextjs' }),
    );
    const config = loadConfig() as ConfigInterface;
    expect(config).toEqual({ language: 'TypeScript', framework: 'nextjs' });
  });

  it('should return 404 if the config file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(loadConfig()).toEqual(404);
  });
});
