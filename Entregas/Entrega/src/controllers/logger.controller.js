
const Test_logger = async (req, res) => {
      req.logger.debug('prueba debug');
      req.logger.http('prueba http');
      req.logger.info('prueba info');
      req.logger.warning('prueba warning');
      req.logger.error('prueba error');
      req.logger.fatal('prueba fatal');
};


export{
   Test_logger
}