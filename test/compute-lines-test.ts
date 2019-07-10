import * as expect from 'expect';
import { computeLineInformation } from '../src/compute-lines';

describe('Testing compute lines utils', (): void => {
  it('Should it avoid trailing spaces', (): void => {
    const oldCode = `test


    `;
    const newCode = `test

    `;

    expect(computeLineInformation(oldCode, newCode))
      .toMatchObject({
        lineInformation: [
          {
            left: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
            right: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
          },
        ],
        diffLines: [],
      });
  });

  it('Should identify line addition', (): void => {
    const oldCode = 'test';
    const newCode = `test
    newLine`;

    expect(computeLineInformation(oldCode, newCode))
      .toMatchObject({
        lineInformation: [
          {
            right: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
            left: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
          },
          {
            right: {
              lineNumber: 2,
              type: 1,
              value: '    newLine',
            },
            left: {},
          },
        ],
        diffLines: [1],
      });
  });

  it('Should identify line deletion', (): void => {
    const oldCode = `test
    oldLine`;
    const newCode = 'test';

    expect(computeLineInformation(oldCode, newCode))
      .toMatchObject({
        lineInformation: [
          {
            right: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
            left: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
          },
          {
            right: {},
            left: {
              lineNumber: 2,
              type: 2,
              value: '    oldLine',
            },
          },
        ],
        diffLines: [1],
      });
  });

  it('Should identify line modification', (): void => {
    const oldCode = `test
    oldLine`;
    const newCode = `test
    newLine`;

    expect(computeLineInformation(oldCode, newCode, true))
      .toMatchObject({
        lineInformation: [
          {
            right: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
            left: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
          },
          {
            right: {
              lineNumber: 2,
              type: 1,
              value: '    newLine',
            },
            left: {
              lineNumber: 2,
              type: 2,
              value: '    oldLine',
            },
          },
        ],
        diffLines: [1],
      });
  });

  it('Should identify word diff', (): void => {
    const oldCode = `test
    oldLine`;
    const newCode = `test
    newLine`;

    expect(computeLineInformation(oldCode, newCode))
      .toMatchObject({
        lineInformation: [
          {
            right: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
            left: {
              lineNumber: 1,
              type: 0,
              value: 'test',
            },
          },
          {
            right: {
              lineNumber: 2,
              type: 1,
              value: [
                {
                  type: 0,
                  value: '    ',
                },
                {
                  type: 1,
                  value: 'new',
                },
                {
                  type: 0,
                  value: 'Line',
                },
              ],
            },
            left: {
              lineNumber: 2,
              type: 2,
              value: [
                {
                  type: 0,
                  value: '    ',
                },
                {
                  type: 2,
                  value: 'old',
                },
                {
                  type: 0,
                  value: 'Line',
                },
              ],
            },
          },
        ],
        diffLines: [1],
      });
  });
});
