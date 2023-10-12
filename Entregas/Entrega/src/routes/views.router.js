import { Router } from "express"

const viewsRouter = (io) => {
   const router = Router();

router.get('/', async (req, res) =>{
   res.render('realTimeProducts');
   
})


return router
}

export default viewsRouter;