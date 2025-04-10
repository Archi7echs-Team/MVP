import { Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3 } from 'three';
import { getValueFromId, filter, getSelectedBarInfo, takeScreenshot, downloadImage, cameraUtils, setBarFilterSelection, resetBarSelection, hideBarFilterPane, isInRange, passesBarFilter, getBarColor, handleTextClick, fetchExternal, uploadFile, sortAscData,sortDescData, isFirstIntersected, isFirstTextIntersected} from '../lib/index.svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDb, fetchedData } from '../lib/index.svelte';
import * as dataModule from '../lib/data.svelte';
import * as indexModule from '../lib/index.svelte';
import { Mesh, BufferGeometry, Material } from 'three';

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
        it('chiama filter.selection.clear() se value è 0', () => {
          // Spy su filter.selection.clear
          const clearSpy = vi.spyOn(filter.selection, 'clear');
      
          // Chiamata alla funzione con value = 0
          setBarFilterSelection(0);
      
          // Verifica che filter.selection.clear() sia stato chiamato
          expect(clearSpy).toHaveBeenCalled();
        });
      
        it('non chiama filter.selection.clear() se value non è 0', () => {
          // Spy su filter.selection.clear
          const clearSpy = vi.spyOn(filter.selection, 'clear');
      
          // Chiamata alla funzione con value = 1 (o altri valori diversi da 0)
          setBarFilterSelection(1);
      
          // Verifica che filter.selection.clear() non sia stato chiamato
          expect(clearSpy).not.toHaveBeenCalled();
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

  /*it('chiama filter.selection.toggle se il click è singolo', () => {
		// Mock delle dipendenze necessarie
		const e = {
			nativeEvent: { detail: 1 },
			pointer: { x: 1, y: 1 },
			camera: { position: { x: 1, y: 1, z: 1 } }
		};
		const filter = { selection: { toggle: vi.fn(), set: vi.fn() } };
    const raycaster = {
			setFromCamera: vi.fn(),
			intersectObjects: vi.fn().mockReturnValue([]) // Nessun oggetto intersecato
		} as unknown as Raycaster; // Cast per evitare l'errore di tipo
		const text = {};
		const scene = { children: [text] };
		const id = '1';

		// Mock per la funzione isFirstTextIntersected che restituisce true
		vi.spyOn(indexModule, 'isFirstTextIntersected').mockReturnValue(true);

		// Chiamata alla funzione
		handleTextClick(e, id, filter, raycaster, text, scene);

		// Verifica che filter.selection.toggle sia stato chiamato con l'id
		expect(filter.selection.toggle).toHaveBeenCalledWith(id);
		expect(filter.selection.set).not.toHaveBeenCalled();
	});

	it('chiama filter.selection.set se il click è doppio', () => {
		// Mock delle dipendenze necessarie
		const e = {
			nativeEvent: { detail: 2 },
			pointer: { x: 1, y: 1 },
			camera: { position: { x: 1, y: 1, z: 1 } }
		};
		const filter = { selection: { toggle: vi.fn(), set: vi.fn() } };
    const raycaster = {
			setFromCamera: vi.fn(),
			intersectObjects: vi.fn().mockReturnValue([]) // Nessun oggetto intersecato
		} as unknown as Raycaster; // Cast per evitare l'errore di tipo
		const text = {};
		const scene = { children: [text] };
		const id = '1';

		// Mock per la funzione isFirstTextIntersected che restituisce true
		vi.spyOn(indexModule, 'isFirstTextIntersected').mockReturnValue(true);

		// Chiamata alla funzione
		handleTextClick(e, id, filter, raycaster, text, scene);

		
		expect(filter.selection.toggle).not.toHaveBeenCalled();
	});*/

});

describe('uploadFile', () => {
	it('aggiorna fetchedData se uploadCsvFile restituisce dati validi', async () => {
		const mockData = {
			yValues: [[7, 8], [9, 10]],
			xLabels: ['U', 'V'],
			zLabels: ['10', '11']
		};

		const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });

		vi.spyOn(dataModule, 'uploadCsvFile').mockResolvedValue(mockData);

		await uploadFile(file);

		expect(fetchedData.values).toEqual(mockData.yValues);
		expect(fetchedData.xLabels).toEqual(mockData.xLabels);
		expect(fetchedData.zLabels).toEqual(mockData.zLabels);
	});

  it('non modifica fetchedData se uploadCsvFile restituisce null', async () => {
    const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
    
    // Cloniamo solo i dati effettivi di fetchedData
    const originalValues = [...fetchedData.values];
    const originalXLabels = [...fetchedData.xLabels];
    const originalZLabels = [...fetchedData.zLabels];

    vi.spyOn(dataModule, 'uploadCsvFile').mockResolvedValue(null);

    await uploadFile(file);

    // Verifica che i dati non siano cambiati
    expect(fetchedData.values).toEqual(originalValues);
    expect(fetchedData.xLabels).toEqual(originalXLabels);
    expect(fetchedData.zLabels).toEqual(originalZLabels);
  });

  it('deve chiamare console.error quando si verifica un errore durante il caricamento del file', async () => {
    const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });

    // Mock della funzione uploadCsvFile che lancia un errore
    vi.spyOn(dataModule, 'uploadCsvFile').mockRejectedValue(new Error('Errore nel caricamento del file'));

    // Spy su console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await uploadFile(file);

    // Verifica che console.error sia stato chiamato con l'errore giusto
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading file:', expect.any(Error));

    // Ripristina il mock
    consoleErrorSpy.mockRestore();
  });


});

describe('sortAscData', () => {
	it('ordina i dati e rimuove i duplicati', () => {
		const data = [
			[3, 5, 2],
			[8, 7, 3],
			[4, 6, 5]
		];

		const result = sortAscData(data);

		expect(result).toEqual([2, 3, 4, 5, 6, 7, 8]);
	});

	it('restituisce un array vuoto se i dati sono vuoti', () => {
		const data: number[][] = [];

		const result = sortAscData(data);

		expect(result).toEqual([]);
	});

	it('mantiene gli elementi unici', () => {
		const data = [
			[1, 2, 3],
			[1, 3, 4]
		];

		const result = sortAscData(data);

		expect(result).toEqual([1, 2, 3, 4]);
	});
});

describe('sortDescData', () => {
	it('ordina i dati in ordine decrescente e rimuove i duplicati', () => {
		const data = [
			[3, 5, 2],
			[8, 7, 3],
			[4, 6, 5]
		];

		const result = sortDescData(data);

		expect(result).toEqual([8, 7, 6, 5, 4, 3, 2]);
	});

	it('restituisce un array vuoto se i dati sono vuoti', () => {
		const data: number[][] = [];

		const result = sortDescData(data);

		expect(result).toEqual([]);
	});

	it('mantiene gli elementi unici', () => {
		const data = [
			[1, 2, 3],
			[1, 3, 4]
		];

		const result = sortDescData(data);

		expect(result).toEqual([4, 3, 2, 1]);
	});
});

// Test for fetchDb function
describe('fetchDb', () => {
	it('aggiorna fetchedData con i dati dal server se disponibili', async () => {
		const mockData = {
			yValues: [[1, 2], [3, 4]],
			xLabels: ['A', 'B'],
			zLabels: ['1', '2']
		};

		vi.spyOn(dataModule, 'getDbData').mockResolvedValue(mockData);

		await fetchDb();

		expect(fetchedData.values).toEqual(mockData.yValues);
		expect(fetchedData.xLabels).toEqual(mockData.xLabels);
		expect(fetchedData.zLabels).toEqual(mockData.zLabels);
	});

	it('non aggiorna fetchedData se getDbData restituisce null', async () => {
		const originalValues = [...fetchedData.values];
    const originalXLabels = [...fetchedData.xLabels];
    const originalZLabels = [...fetchedData.zLabels];
		vi.spyOn(dataModule, 'getDbData').mockResolvedValue(null);

		await fetchDb();

		expect(fetchedData.values).toEqual(originalValues);
    expect(fetchedData.xLabels).toEqual(originalXLabels);
    expect(fetchedData.zLabels).toEqual(originalZLabels);
	});
});

describe('fetchExternal', () => {
	it('aggiorna fetchedData con i dati dal server se disponibili', async () => {
		const mockData = {
			yValues: [[1, 2], [3, 4]],
			xLabels: ['A', 'B'],
			zLabels: ['1', '2']
		};
    vi.spyOn(dataModule, 'getExternalData').mockResolvedValue(mockData);

    await fetchExternal();

    expect(fetchedData.values).toEqual(mockData.yValues);
		expect(fetchedData.xLabels).toEqual(mockData.xLabels);
		expect(fetchedData.zLabels).toEqual(mockData.zLabels);
	});
  it('non aggiorna fetchedData se getExternalData restituisce null', async () => {
		const originalValues = [...fetchedData.values];
		const originalXLabels = [...fetchedData.xLabels];
		const originalZLabels = [...fetchedData.zLabels];
    vi.spyOn(dataModule, 'getExternalData').mockResolvedValue(null);
    await fetchExternal();
    expect(fetchedData.values).toEqual(originalValues);
		expect(fetchedData.xLabels).toEqual(originalXLabels);
		expect(fetchedData.zLabels).toEqual(originalZLabels);
	});
});

describe('isFirstIntersected', () => {
	it('restituisce true se l\'oggetto è intersecato', () => {
		// Crea un oggetto mesh mock con le proprietà necessarie
		const mesh = new Mesh(new BufferGeometry(), new Material());

		// Mock delle dipendenze necessarie
		const e = {
			pointer: { x: 1, y: 1 },
			camera: { position: { x: 1, y: 1, z: 1 } }
		};
		
		// Mock parziale di Raycaster
		const raycaster = {
			setFromCamera: vi.fn(),
			intersectObjects: vi.fn().mockReturnValue([
				{ object: mesh } // Restituisci il mesh come oggetto intersecato
			])
		} as unknown as Raycaster; // Cast per evitare l'errore di tipo

		const scene = { children: [mesh] };

		// Chiamata alla funzione
		const result = isFirstIntersected(e, raycaster, mesh, scene);

		// Verifica che la funzione restituisca true
		expect(result).toBe(true);
		expect(raycaster.setFromCamera).toHaveBeenCalledWith(e.pointer, e.camera);
		expect(raycaster.intersectObjects).toHaveBeenCalledWith(scene.children, true);
	});

	it('restituisce false se l\'oggetto non è intersecato', () => {
		// Crea un oggetto mesh mock con le proprietà necessarie
		const mesh = new Mesh(new BufferGeometry(), new Material());

		// Mock delle dipendenze necessarie
		const e = {
			pointer: { x: 1, y: 1 },
			camera: { position: { x: 1, y: 1, z: 1 } }
		};
		
		// Mock parziale di Raycaster
		const raycaster = {
			setFromCamera: vi.fn(),
			intersectObjects: vi.fn().mockReturnValue([]) // Nessun oggetto intersecato
		} as unknown as Raycaster; // Cast per evitare l'errore di tipo

		const scene = { children: [mesh] };

		// Chiamata alla funzione
		const result = isFirstIntersected(e, raycaster, mesh, scene);

		// Verifica che la funzione restituisca false
		expect(result).toBe(false);
		expect(raycaster.setFromCamera).toHaveBeenCalledWith(e.pointer, e.camera);
		expect(raycaster.intersectObjects).toHaveBeenCalledWith(scene.children, true);
	});
});

