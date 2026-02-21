# Framework Pattern Checklists

Use in Step 4. Only check frameworks whose dependencies were detected in Step 1. Grep for indicators; read matching files to confirm.

## JavaScript/TypeScript

| Framework | Entry indicators | Convention patterns to grep |
|-----------|-----------------|---------------------------|
| Express | `express()`, `app.use(`, `app.get(` | `router.`, `middleware/`, `next(err)`, `app.listen` |
| Next.js | `pages/` or `app/` directory | `getServerSideProps`, `getStaticProps`, `use client`, `use server`, `middleware.ts` |
| NestJS | `@Module(`, `@Controller(` | `@Injectable()`, `@Get(`, `@Post(`, `*.module.ts`, `*.service.ts` |
| Fastify | `fastify(`, `fastify.register` | `fastify.route`, `fastify.decorate`, `preHandler` |
| React (SPA) | `createRoot`, `ReactDOM.render` | `useState`, `useEffect`, `<Provider`, `*.context.ts` |

## Python

| Framework | Entry indicators | Convention patterns to grep |
|-----------|-----------------|---------------------------|
| FastAPI | `FastAPI()`, `@app.get` | `@router.`, `Depends(`, `BaseModel`, `async def` |
| Django | `urlpatterns`, `INSTALLED_APPS` | `models.Model`, `views.py`, `serializers.py`, `admin.py` |
| Flask | `Flask(__name__)`, `@app.route` | `Blueprint(`, `current_app`, `g.`, `before_request` |

## Rust

| Framework | Entry indicators | Convention patterns to grep |
|-----------|-----------------|---------------------------|
| Actix-web | `HttpServer::new`, `App::new()` | `web::get()`, `#[get(`, `web::Data<`, `impl Responder` |
| Axum | `axum::Router`, `Router::new()` | `.route(`, `extract::`, `Extension(`, `impl IntoResponse` |

## Go

| Framework | Entry indicators | Convention patterns to grep |
|-----------|-----------------|---------------------------|
| net/http | `http.ListenAndServe`, `http.HandleFunc` | `http.Handler`, `http.ServeMux`, `w http.ResponseWriter` |
| Gin | `gin.Default()`, `gin.New()` | `r.GET(`, `c.JSON(`, `gin.Context`, `r.Group(` |
| Echo | `echo.New()` | `e.GET(`, `echo.Context`, `e.Group(` |

## Cross-cutting (all ecosystems)

Grep regardless of framework:

| Pattern | Grep indicators |
|---------|----------------|
| Error classes | `extends Error`, `class.*Error`, `Exception`, `#[derive(.*Error)]` |
| Logger setup | `createLogger`, `getLogger`, `Logger.new`, `slog.New`, `tracing::` |
| Config loading | `dotenv`, `config.get`, `BaseSettings`, `viper.`, `figment::` |
| DI/IoC | `@Injectable`, `@inject`, `wire.Build`, `Depends(`, `Container` |
| Queue/Worker | `Bull`, `BullMQ`, `Celery`, `Sidekiq`, `Faktory`, `tokio::spawn` |
| Feature flags | `LaunchDarkly`, `unleash`, `flagsmith`, `feature_flag`, `GrowthBook` |
