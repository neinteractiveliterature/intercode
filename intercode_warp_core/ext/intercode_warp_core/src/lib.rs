mod registration_policy;
mod signup_count_presenter;

use std::{borrow::Cow, collections::HashMap};

use log::LevelFilter;
use magnus::{define_module, function, method, prelude::*, Error, ExceptionClass};
use once_cell::sync::{Lazy, OnceCell};
use signup_count_presenter::RunSignupCounts;
use sqlx::{
    postgres::{PgConnectOptions, PgPoolOptions},
    ConnectOptions, PgPool,
};
use tokio::runtime::Runtime;
use tracing::info;
use tracing_subscriber::{
    fmt, prelude::__tracing_subscriber_SubscriberExt, util::SubscriberInitExt, EnvFilter,
};

static RUNTIME: Lazy<Runtime> = Lazy::new(|| Runtime::new().unwrap());
static POOL: OnceCell<PgPool> = OnceCell::new();

fn connect_db(database_url: String) -> Result<(), Error> {
    POOL.get_or_try_init(|| {
        let mut conn_options = database_url
            .parse::<PgConnectOptions>()
            .map_err(|err| Error::Error(ExceptionClass::default(), err.to_string().into()))?;
        conn_options.log_statements(LevelFilter::Info);

        let pool_options = PgPoolOptions::new().max_connections(1);

        RUNTIME
            .block_on(async {
                pool_options
                    .connect_with(conn_options)
                    .await
                    .map_err(|err| Error::Error(ExceptionClass::default(), err.to_string().into()))
            })
            .map(|pool| {
                info!("intercode_warp_core connected to database");
                pool
            })
    })?;

    Ok(())
}

fn load_signup_count_data_for_run_ids(
    run_ids: Vec<i64>,
) -> Result<HashMap<i64, RunSignupCounts>, Error> {
    let pool = POOL.get().ok_or_else(|| {
        Error::Error(
            ExceptionClass::default(),
            Cow::Borrowed("intercode_warp_core has no database connection"),
        )
    })?;

    RUNTIME.block_on(async {
        signup_count_presenter::load_signup_count_data_for_run_ids(pool, run_ids.into_iter())
            .await
            .map_err(|err| Error::Error(ExceptionClass::default(), err.to_string().into()))
    })
}

#[magnus::init]
fn init() -> Result<(), Error> {
    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env())
        .init();

    let module = define_module("IntercodeWarpCore")?;
    module.define_singleton_method("connect_db", function!(connect_db, 1))?;
    module.define_singleton_method(
        "load_signup_count_data_for_run_ids",
        function!(load_signup_count_data_for_run_ids, 1),
    )?;

    let rsc = module.define_class("RunSignupCounts", Default::default())?;
    rsc.define_method(
        "signup_count_by_state_and_bucket_key_and_counted",
        method!(
            RunSignupCounts::signup_count_by_state_and_bucket_key_and_counted,
            3
        ),
    )?;
    rsc.define_method(
        "counted_signups_by_state",
        method!(RunSignupCounts::counted_signups_by_state, 1),
    )?;
    rsc.define_method(
        "not_counted_signups_by_state",
        method!(RunSignupCounts::not_counted_signups_by_state, 1),
    )?;
    Ok(())
}
