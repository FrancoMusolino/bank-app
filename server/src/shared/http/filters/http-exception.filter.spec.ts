import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

const filter = new HttpExceptionFilter();

describe('HTTP Exception Filter', () => {
  const mockDate = '2000-01-01T00:00:00.000Z';
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const request = {
    url: '/example',
    method: 'POST',
  };

  const host = {
    switchToHttp() {
      return {
        getRequest: jest.fn().mockReturnValue(request),
        getResponse: jest.fn().mockReturnValue(response),
      };
    },
  };

  beforeEach(() => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);
  });

  afterEach(() => {
    response.status.mockClear();
    response.json.mockClear();
  });

  it('Should return the app standard error object', () => {
    const error = new BadRequestException('Error');
    filter.catch(error, host as any);

    expect(response.status).toHaveBeenCalledWith(error.getStatus());
    expect(response.json).toHaveBeenCalledWith({
      path: request.url,
      method: request.method,
      timestamp: mockDate,
      error: {
        error: 'Bad Request',
        message: error.message,
        statusCode: error.getStatus(),
      },
    });
  });

  it('Should return the first error value on array', () => {
    const error = new BadRequestException(['Error 1', 'Error 2']);
    filter.catch(error, host as any);

    expect(response.json).toHaveBeenCalledWith({
      path: request.url,
      method: request.method,
      timestamp: mockDate,
      error: {
        error: 'Bad Request',
        message: 'Error 1',
        statusCode: error.getStatus(),
      },
    });
  });

  it('Should return a default response if it is an unknown error', () => {
    filter.catch(
      { getStatus() {}, getResponse() {} } as HttpException,
      host as any,
    );

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      error: 'Server Eror',
    });

    filter.catch(
      {
        getStatus() {},
        getResponse() {
          return { error: 'unknow' };
        },
      } as HttpException,
      host as any,
    );

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      error: 'Server Eror',
    });
  });
});
