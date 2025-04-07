import { Vector3 } from 'three';
import { getData, getValueFromId, filter, getSelectedBarInfo, truncateText, takeScreenshot, downloadImage, cameraUtils } from '../lib/index.svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Index', () => {
    it("getData() return the correct data", () => { 
        const data = getData();
        expect(data.values.length).toBe(5);
        expect(data.computed.rows).toBe(5);
        expect(data.computed.cols).toBe(5);
        expect(data.computed.average).toBeGreaterThan(0); 
    });

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

    it('should truncate text longer than maxLength and append "..."', () => {
        const result = truncateText('Questo è un testo molto lungo', 10);
        expect(result).toBe('Questo è u...');
      });
    
      it('should return the original text if it is shorter than maxLength', () => {
        const result = truncateText('Testo corto', 20);
        expect(result).toBe('Testo corto');
      });
    
      it('should return the original text if it is exactly maxLength', () => {
        const result = truncateText('1234567890', 10);
        expect(result).toBe('1234567890');
      });
    
      it('should use the default maxLength of 20 when not provided', () => {
        const result = truncateText('Questo è un testo abbastanza lungo da essere troncato');
        expect(result).toBe('Questo è un testo ab...');
      });
    
      it('should handle empty string input', () => {
        const result = truncateText('', 10);
        expect(result).toBe('');
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

        //mancherebbe il test su updateCamera
    });