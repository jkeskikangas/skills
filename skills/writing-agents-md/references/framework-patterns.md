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

## C# / .NET

| Framework | Entry indicators | Convention patterns |
|-----------|-----------------|-------------------|
| ASP.NET Core Minimal API | `app.MapGet(`, `WebApplication.Create` | `builder.Services.Add`, `.AddDbContext<`, `MapPost`, `IEndpointRouteBuilder` |
| ASP.NET Core MVC | `[ApiController]`, `ControllerBase` | `[HttpGet`, `[HttpPost`, `IActionResult`, `Controllers/`, `[Route(` |
| ASP.NET Core Razor Pages | `MapRazorPages`, `PageModel` | `Pages/`, `.cshtml`, `OnGet`, `OnPost` |

## Java

| Framework | Entry indicators | Convention patterns |
|-----------|-----------------|-------------------|
| Spring Boot | `@SpringBootApplication`, `SpringApplication.run` | `@RestController`, `@Service`, `@Repository`, `@Autowired`, `application.properties` |
| Quarkus | `@QuarkusMain`, `quarkus.` in config | `@Path(`, `@Inject`, `quarkus.` prefix in `application.properties` |
| Micronaut | `@MicronautApplication`, `Micronaut.run` | `@Controller`, `@Singleton`, `@Inject`, `micronaut.` in `application.yml` |

## Clojure

| Framework | Entry indicators | Convention patterns |
|-----------|-----------------|-------------------|
| Babashka | `bb.edn` only (no `project.clj`/`deps.edn`) | `bb`, `babashka.fs`, `babashka.process`; treat as scripts, not a server framework |
| Ring/Compojure | `defroutes`, `wrap-`, `make-handler` | `context`, `GET`, `POST`, `ANY` (compojure.core) |
| Pedestal | `http/create-server`, `::http/routes` | `http/start`, `::http/type`, `route/expand-routes` |
| Luminus | `mount/start`, `app-routes` | `defroutes`, `layout/render`, `db.core` |

## Scala

| Framework | Entry indicators | Convention patterns |
|-----------|-----------------|-------------------|
| Play Framework | `app/controllers/`, `conf/routes` | `Action`, `implicit request`, `Ok(`, `Json.toJson`, `play.api.mvc` |
| http4s | `HttpRoutes.of`, `EmberServerBuilder` | `case req @ GET ->`, `IO[Response`, `BlazeServerBuilder` (legacy), `HttpApp` |
| ZIO HTTP | `Http.collect`, `ZServer`, `Server.start` | `ZIO.succeed`, `Route`, `Response.json` |

## Haskell

| Framework | Entry indicators | Convention patterns |
|-----------|-----------------|-------------------|
| Servant | `type API =`, `serve`, `Proxy` | `Handler`, `:<|>`, `:>`, `hoistServer`, `ServerT` |
| Yesod | `mkYesod`, `warpEnv`, `yesodDispatch` | `getHomeR`, `postLoginR`, `defaultLayout`, `hamlet` |
| Scotty | `scotty`, `scottyApp` | `get`, `post`, `json`, `ActionM`, `status` |

## Cross-cutting (all ecosystems)

Grep regardless of framework:

| Pattern | Grep indicators |
|---------|----------------|
| Error classes | `extends Error`, `class.*Error`, `Exception`, `#[derive(.*Error)]`, `data.*Exception`, `case class.*extends.*Exception`, `newtype.*Error`, `data.*Error =` |
| Logger setup | `createLogger`, `getLogger`, `Logger.new`, `slog.New`, `tracing::`, `timbre/`, `com.typesafe.scalalogging`, `katip`, `monad-logger` (source); `log4j`, `SLF4J` (build config deps) |
| Config loading | `dotenv`, `config.get`, `BaseSettings`, `viper.`, `figment::`, `ConfigFactory.load`, `environ.core`, `aero.core`, `pureconfig`, `tomland` |
| DI/IoC | `@Injectable`, `@inject`, `wire.Build`, `Depends(`, `Container` |
| Queue/Worker | `Bull`, `BullMQ`, `Celery`, `Sidekiq`, `Faktory`, `tokio::spawn` |
| Feature flags | `LaunchDarkly`, `unleash`, `flagsmith`, `feature_flag`, `GrowthBook` |
