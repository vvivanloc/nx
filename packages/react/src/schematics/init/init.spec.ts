import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { addDepsToPackageJson, readJsonInTree } from '@nrwl/workspace';
import { callRule, runSchematic } from '../../utils/testing';
import { reactVersion } from '../../utils/versions';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
    tree = createEmptyWorkspace(tree);
  });

  it('should add react dependencies', async () => {
    await callRule(
      addDepsToPackageJson({ '@nrwl/react': reactVersion }, {}, false),
      tree
    );
    const result = await runSchematic('init', {}, tree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.dependencies['@nrwl/react']).toBeUndefined();
    expect(packageJson.dependencies['react']).toBeDefined();
    expect(packageJson.dependencies['react-dom']).toBeDefined();
    expect(packageJson.devDependencies['@nrwl/react']).toBeDefined();
    expect(packageJson.devDependencies['@types/react']).toBeDefined();
    expect(packageJson.devDependencies['@types/react-dom']).toBeDefined();
    expect(packageJson.devDependencies['@testing-library/react']).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      const result = await runSchematic('init', {}, tree);
      const workspaceJson = readJsonInTree(result, 'workspace.json');
      expect(workspaceJson.cli.defaultCollection).toEqual('@nrwl/react');
      expect(workspaceJson.schematics['@nrwl/react'].application.babel).toBe(
        true
      );
    });
  });
});
