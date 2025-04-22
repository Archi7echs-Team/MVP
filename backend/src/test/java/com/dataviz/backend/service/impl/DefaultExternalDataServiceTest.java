package com.dataviz.backend.service.impl;

import com.dataviz.backend.controller.BackendApplication;
import com.dataviz.backend.domain.port.out.ExternalDataPort;
import com.dataviz.backend.model.MatrixData;
import com.dataviz.backend.model.impl.MatrixDataImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DefaultExternalDataServiceTest {

    @Mock
    ExternalDataPort externalDataPort;

    @InjectMocks
    DefaultExternalDataService externalDataService;

    @Test
    void fetchData_delegatesToExternalPort() {
        MatrixData mock = new MatrixDataImpl(List.of(), List.of(), new double[0][0]);
        when(externalDataPort.fetchData()).thenReturn(mock);

        MatrixData result = externalDataService.fetchData();

        assertSame(mock, result);
        verify(externalDataPort).fetchData();
    }
}