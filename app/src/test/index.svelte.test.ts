import { Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3 } from 'three';
import { getValueFromId, filter, getSelectedBarInfo, takeScreenshot, downloadImage, cameraUtils, setBarFilterSelection, resetBarSelection, hideBarFilterPane, isInRange, passesBarFilter, getBarColor, handleTextClick } from '../lib/index.svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { writable } from 'svelte/store';

describe('Index', () => {
    it("getValueFromId() return the correct value", () => {
        expect(getValueFromId('0-0')).toBe(2);
        expect(getValueFromId('2-2')).toBe(7);
    });

    it("selectionToggle add and remove the id from the selected array", () => {
        const sel = filter.selection;
        sel.clear();
        sel.toggle('1-1');
        expect(sel.check('1-1')).toBe(true);
        sel.toggle('1-1');
        expect(sel.check('1-1')).toBe(false);
    });

    it("load the correct default value", () => {  
        expect(filter.spacing).toBe(2);
        expect(filter.avgEnabled).toBe(false);
        expect(filter.colorSelection).toBe(2);
    });

    it("lastValue return 0 if there aren't any selected bars", () => {
        const sel = filter.selection;
        sel.clear();
        expect(sel.lastValue()).toBe(0);
    });

    it("lastValue return the last selected value", () => {
        const sel = filter.selection;
        sel.clear();
        sel.toggle('1-1');
        expect(sel.lastValue()).toBe(4);
    });

    it("set replace all selection", () => {
        const sel = filter.selection;
        sel.set(['0-0', '1-1']);
        expect(sel.selected).toEqual(['0-0', '1-1']);
        sel.set(['3-2']);
        expect(sel.selected).toEqual(['3-2']);
    });

    it("set with empty array clear the selection", () => {
        const sel = filter.selection;
        sel.set(['2-2']);
        expect(sel.selected).toEqual(['2-2']);
        sel.set([]);
        expect(sel.selected).toEqual([]);
    });

    it("filter initializes with default values", () => {
        expect(filter.rangeValue).toEqual({ min: 0, max: 0 });
        expect(filter.colorSelection).toBe(2);
        expect(filter.avgFilter).toBe(0);
        expect(filter.avgEnabled).toBe(false);
        expect(filter.barFilterSelection).toBe(0);
        expect(filter.displayBarFilter).toBe(false);
        expect(filter.selectedOpacity).toBe(100);
        expect(filter.showRowAvgPlane).toBe(false);
        expect(filter.showColAvgPlane).toBe(false);
    });
    
    it("filter rangeValue is updated correctly", () => {
        filter.rangeValue = { min: 1, max: 10 };
        expect(filter.rangeValue).toEqual({ min: 1, max: 10 });
    });
    
    it("filter avgEnabled toggle works correctly", () => {
        filter.avgEnabled = true;
        expect(filter.avgEnabled).toBe(true);
        filter.avgEnabled = false;
        expect(filter.avgEnabled).toBe(false);
    });
    
    it("filter colorSelection updates correctly", () => {
        filter.colorSelection = 3;
        expect(filter.colorSelection).toBe(3);
    });

    it("getSelectedBarInfo returns null when no bars are selected", () => {
        const sel = filter.selection;
        sel.clear();
        const result = getSelectedBarInfo();
        expect(result).toBeNull();
    });
    
    it("getSelectedBarInfo returns correct bar info when a bar is selected", () => {
        const sel = filter.selection;
        sel.clear();
        sel.toggle('1-1');
        
        const result = getSelectedBarInfo();
        expect(result).toEqual({
            row: 2,
            column: 2,
            height: 4,
        });
    });
    
});


describe('takeScreenshot', () => {
    let mockRenderer: any;
    let mockScene: any;
    let mockCamera: any;
  
    beforeEach(() => {
      mockRenderer = {
        render: vi.fn(),
        domElement: {
          toDataURL: vi.fn().mockReturnValue('data:image/png;base64,fakeimage'),
        },
        setClearColor: vi.fn()
      };
  
      mockScene = {}; // Non usato direttamente nella funzione, quindi può essere vuoto
      mockCamera = {
        current: {}
      };

      const mockClick = vi.fn();
  
      // Mock globale per downloadImage
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        let _download = '';
        let _href = '';
        return {
          set download(value: string) {
            _download = value;
          },
          get download() {
            return _download;
          },
          set href(value: string) {
            _href = value;
          },
          get href() {
            return _href;
          },
          click: mockClick
        } as unknown as HTMLAnchorElement;
      });
    });
  
    it('should call renderer.render and renderer.setClearColor', () => {
      const spyDownload = vi.spyOn(document, 'createElement');
  
      takeScreenshot(mockRenderer, mockScene, mockCamera);
  
      expect(mockRenderer.render).toHaveBeenCalledWith(mockScene, mockCamera.current);
      expect(mockRenderer.setClearColor).toHaveBeenCalledWith('#0e1625');
      expect(mockRenderer.domElement.toDataURL).toHaveBeenCalled();
      expect(spyDownload).toHaveBeenCalledWith('a');
    });
  });
  
  describe('downloadImage', () => {
    it('should create a link and trigger click', () => {
        const mockClick = vi.fn();
        let _download = '';
        let _href = '';
      
        const mockLink = {
          set download(value: string) {
            _download = value;
          },
          get download() {
            return _download;
          },
          set href(value: string) {
            _href = value;
          },
          get href() {
            return _href;
          },
          click: mockClick
        };
      
        vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
      
        const fakeUrl = 'data:image/png;base64,fakeimage';
        downloadImage(fakeUrl);
      
        expect(_download).toContain('Screenshot_');
        expect(_href).toBe(fakeUrl);
        expect(mockClick).toHaveBeenCalled();
      });
    });

    describe('cameraUtils', () => {
        let mockCamera: any;
        let mockResetTarget: any;
    
        beforeEach(() => {
            mockCamera = {
                current: {
                    position: { copy: vi.fn(), add: vi.fn() },
                    getWorldDirection: vi.fn(() => new Vector3()),
                }
            };
            mockResetTarget = vi.fn();
        });
    
        it('should reset camera position correctly', () => {
            cameraUtils.resetCamera(mockCamera, mockResetTarget);
            expect(mockCamera.current.position.copy).toHaveBeenCalledWith(expect.anything());
            expect(mockResetTarget).toHaveBeenCalled();
        });
    
        it('should zoom in the camera', () => {
            const originalPosition = { ...mockCamera.current.position };
            cameraUtils.zoomIn(mockCamera);
            expect(mockCamera.current.position.add).toHaveBeenCalled();
        });
    
        it('should zoom out the camera', () => {
            const originalPosition = { ...mockCamera.current.position };
            cameraUtils.zoomOut(mockCamera);
            expect(mockCamera.current.position.add).toHaveBeenCalled();
        });
    });

    describe('filter utility functions', () => {
      beforeEach(() => {
        filter.barFilterSelection = 0;
        filter.displayBarFilter = true;
        filter.selection.set(['0-0', '1-1']);
      });
    
      describe('setBarFilterSelection', () => {
        it('should set barFilterSelection to a valid value', () => {
          setBarFilterSelection(1);
          expect(filter.barFilterSelection).toBe(1);
    
          setBarFilterSelection(2);
          expect(filter.barFilterSelection).toBe(2);
        });
    
        it('should not change barFilterSelection if value is invalid', () => {
          setBarFilterSelection(99);
          expect(filter.barFilterSelection).not.toBe(99);
        });
      });
    
      describe('resetBarSelection', () => {
        it('should clear the selection array', () => {
          expect(filter.selection.selected.length).toBeGreaterThan(0);
          resetBarSelection();
          expect(filter.selection.selected.length).toBe(0);
        });
      });
    
      describe('hideBarFilterPane', () => {
        it('should set displayBarFilter to false', () => {
          hideBarFilterPane();
          expect(filter.displayBarFilter).toBe(false);
        });
      });
    });

    describe('isInRange', () => {
      it('should return true if height is within the range', () => {
          filter.rangeValue = { min: 2, max: 5 };
          expect(isInRange(3)).toBe(true);
          expect(isInRange(5)).toBe(true);
          expect(isInRange(2)).toBe(true);
      });
  
      it('should return false if height is outside the range', () => {
          filter.rangeValue = { min: 2, max: 5 };
          expect(isInRange(1)).toBe(false);
          expect(isInRange(6)).toBe(false);
      });
  
      it('should return false if min and max are equal', () => {
          filter.rangeValue = { min: 5, max: 5 };
          expect(isInRange(5)).toBe(true); // This should be true, as the height equals the range
          expect(isInRange(6)).toBe(false);
      });
  });

  describe('passesBarFilter', () => {
    it('should return true if the bar passes the filter (avgFilter == 0)', () => {
        filter.avgFilter = 0;
        filter.barFilterSelection = 0;
        expect(passesBarFilter('0-0', 2)).toBe(true);
    });

    it('should return false if the bar does not pass the filter (avgFilter == 1)', () => {
        filter.avgFilter = 1;
        filter.barFilterSelection = 0;
        expect(passesBarFilter('0-0', 6)).toBe(false); // height > average
    });

    it('should return false if the bar does not pass the filter (avgFilter == 2)', () => {
        filter.avgFilter = 2;
        filter.barFilterSelection = 0;
        expect(passesBarFilter('0-0', 1)).toBe(false); // height < average
    });

    it('should return false if the bar does not pass the filter (barFilterSelection == 2)', () => {
        filter.barFilterSelection = 2;
        filter.selection.add('0-0');
        expect(passesBarFilter('0-0', 5)).toBe(false); // height <= lastValue
    });

    it('should return false if the bar does not pass the filter (barFilterSelection == 3)', () => {
        filter.barFilterSelection = 3;
        filter.selection.add('0-0');
        expect(passesBarFilter('0-0', 5)).toBe(false); // height >= lastValue
    });

    it('should return true if no filters apply', () => {
        filter.avgFilter = 0;
        filter.barFilterSelection = 0;
        expect(passesBarFilter('1-1', 3)).toBe(true); // default condition
    });
});

describe('getBarColor', () => {
  it('should return default color (#ffffff) when colorSelection is 0', () => {
    filter.colorSelection = 0;
    const color = getBarColor([1, 2, 3], 5);
    expect(color).toBe('#ffffff');
});

  it('should return a color based on the x-coordinate when colorSelection is 1', () => {
      filter.colorSelection = 1;
      const color = getBarColor([1, 2, 3], 5);
      expect(color).toContain('hsl');
  });

  it('should return a color based on the z-coordinate when colorSelection is 2', () => {
      filter.colorSelection = 2;
      const color = getBarColor([1, 2, 3], 5);
      expect(color).toContain('hsl');
  });

  it('should return a color based on the height value when colorSelection is 3', () => {
      filter.colorSelection = 3;
      filter.rangeValue = { min: 0, max: 10 };
      const color = getBarColor([1, 2, 3], 5);
      expect(color).toContain('hsl');
  });
});

describe('Raycasting functions', () => {
  const raycaster = new Raycaster();
  const scene = new Scene();

  const fakePointerEvent = {
      pointer: new Vector2(0, 0),
      camera: new PerspectiveCamera(),
      nativeEvent: {
          detail: 1
      }
  };

  it('handleTextClick does nothing if not intersected', () => {
      const text = new Object3D();
      raycaster.intersectObjects = vi.fn(() => []);

      const filterMock = {
          selection: {
              toggle: vi.fn(),
              set: vi.fn()
          }
      };

      handleTextClick(fakePointerEvent, '1-1', filterMock, raycaster, text, scene);

      expect(filterMock.selection.toggle).not.toHaveBeenCalled();
      expect(filterMock.selection.set).not.toHaveBeenCalled();
  });
});