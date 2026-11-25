{
  action_text-trix = {
    dependencies = ["railties"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "02a0yz97d12cf6wcj5r43ak57mhlcj4r84k5ma2g570046aga4kh";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.1.19";
  };
  actioncable = {
    dependencies = ["actionpack" "activesupport" "nio4r" "websocket-driver" "zeitwerk"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1z67s63cwr400z6rcrlxdq5scyjac9b2mwz9154fjwvr57vp0xh0";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  actionmailbox = {
    dependencies = ["actionpack" "activejob" "activerecord" "activestorage" "activesupport" "mail"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0y4g3bp6dk416j4kq9lbzhlc2j0yq8bpk2z3p0qkwfmz8bc3vd0q";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  actionmailer = {
    dependencies = ["actionpack" "actionview" "activejob" "activesupport" "mail" "rails-dom-testing"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0rnhk9r93jyc5lrsrkpfgcprmkpd6h33b5qyfpb8vr24yznivdx7";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  actionpack = {
    dependencies = ["actionview" "activesupport" "nokogiri" "rack" "rack-session" "rack-test" "rails-dom-testing" "rails-html-sanitizer" "useragent"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0jybf0v6vw571dpybzva6r72cbiyxchgzqdx742yylr6pmy2wvwc";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  actiontext = {
    dependencies = ["action_text-trix" "actionpack" "activerecord" "activestorage" "activesupport" "globalid" "nokogiri"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1niq5kk32ks2fn8kzvrm3r5xdkg6zan96ry6rsznnavfq4fn2ngv";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  actionview = {
    dependencies = ["activesupport" "builder" "erubi" "rails-dom-testing" "rails-html-sanitizer"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0azicca8i0l1rflz25vwzmaflvxyzkrjr2zyzigikh6hz2f4snyj";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  activejob = {
    dependencies = ["activesupport" "globalid"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ab2yd79h5xac0zmyzr3lvawl9v5kdghqjhkgxgns0d13qqwki42";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  activemodel = {
    dependencies = ["activesupport"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "019806vxvjp20h7k7ngp8g0cafp67pi4p7kq5n5wkyvjac8ayg06";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  activerecord = {
    dependencies = ["activemodel" "activesupport" "timeout"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "11vywsy6rgih4w1annn784bjg7gnmz3l4pc3gy9i1lmml2f5jrdx";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  activerecord-session_store = {
    dependencies = ["actionpack" "activerecord" "cgi" "rack" "railties"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1xl07slqh1br7q07rxmgjlikgmsa3k9596n13s9m9bji9hyasriy";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.3.0";
  };
  activestorage = {
    dependencies = ["actionpack" "activejob" "activerecord" "activesupport" "marcel"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0rjwy1wfs9ifg34qbhxjl1jyfw31rjm8kh52h0x7511m9w8jykhg";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  activesupport = {
    dependencies = ["base64" "bigdecimal" "concurrent-ruby" "connection_pool" "drb" "i18n" "json" "logger" "minitest" "securerandom" "tzinfo" "uri"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1mvy0408pvfs4wx9qvsa7jgaw6l9d0zwg2nvzjhqap563hs4zb0n";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  acts_as_list = {
    dependencies = ["activerecord"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0v87zp00q3vy7fz98x28l1pyl1zcr58b6q5izbn5ncvqkckd152z";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.9.16";
  };
  addressable = {
    dependencies = ["public_suffix"];
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0456x4wxahdscbld1z2lqr6kamdf06agnhfffl7261zfsvkwf5wi";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.9.2";
  };
  ahoy_matey = {
    dependencies = ["activesupport" "cgi" "device_detector" "safely_block"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1invihg7zwwf4f21dhqc1v5w9cq1wvfjpymzs0xj7476q5whaa44";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "5.5.0";
  };
  annotaterb = {
    dependencies = ["activerecord" "activesupport"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "05lm7jik8nkzxqvm0afldrk6nzjrmmf51hggp6w98y1gm76a317q";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.26.0";
  };
  ansi = {
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0n36cqp65cq259n86wsbyf18iirsjq4ycj0k4x7gncldxb0a17mc";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.6.0";
  };
  apollo_upload_server = {
    dependencies = ["actionpack" "graphql"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1s584m5ilmdzki2m99ny5n0pgcq6d5dsm2gwla4gyfdiw7q14j20";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.1.8";
  };
  ast = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "10yknjyn0728gjn6b5syynvrvrwm66bhssbxq8mkhshxghaiailm";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.4.3";
  };
  aws-actionmailer-ses = {
    dependencies = ["actionmailer" "aws-sdk-ses" "aws-sdk-sesv2"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0zqhi4pdwxlvipp7zxn78h0k35syjkkib2xvj6xrli7ibg6cy770";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.2.0";
  };
  aws-eventstream = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "15nf544xhbhxgm4d38479yifqjspa41ysjp58h1v0jyzc6fakdnf";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.4.1";
  };
  aws-partitions = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1xfzykznf1z01fyfm5qisdqcjrkiwzambi9552mcg6rymi7apb09";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1309.0";
  };
  aws-sdk-cloudwatchevents = {
    dependencies = ["aws-sdk-core" "aws-sigv4"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "197g0s6v64hk700q8xc6fgxa05hmgvsc509lf6wz2gbr535sldy0";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.70.0";
  };
  aws-sdk-core = {
    dependencies = ["aws-eventstream" "aws-partitions" "aws-sigv4" "base64" "bigdecimal" "jmespath" "logger" "rexml"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0j4w10m02yd8sar72pw78p5ndp3v7q32h3sqzr5s8k9pxc96c07f";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.271.1";
  };
  aws-sdk-kms = {
    dependencies = ["aws-sdk-core" "aws-sigv4"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0lw8ypfa5jh0pdqb6hgxnraybfp81ky6h2s8s25s5y9llky8dgnx";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.145.0";
  };
  aws-sdk-rails = {
    dependencies = ["aws-sdk-core" "railties"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1d78625rairl4w10ax3kdwjg1463nnyzl567qdm4pbnz7y51d6v3";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "5.2.0";
  };
  aws-sdk-rds = {
    dependencies = ["aws-sdk-core" "aws-sigv4"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "013q46cqcws5y6vfpd3vhkcijmv17kiraqpsc21nrrp0pqjcdzl1";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.316.0";
  };
  aws-sdk-s3 = {
    dependencies = ["aws-sdk-core" "aws-sdk-kms" "aws-sigv4"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ymd9wa19ss5x8n29id6vhar50vacj1yfj1vdy68qwk9v6jxj0nz";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.245.2";
  };
  aws-sdk-ses = {
    dependencies = ["aws-sdk-core" "aws-sigv4"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1bpfckfgkkz6gkg8j0dfkkv5zsc6mjr4jr0zq15ri4wpnfjm5v8f";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.116.0";
  };
  aws-sdk-sesv2 = {
    dependencies = ["aws-sdk-core" "aws-sigv4"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "049lycrfw4hj5bgscvwgnkpdzwifc8yk36ddbgv251f52p4b9ily";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.99.0";
  };
  aws-sdk-sns = {
    dependencies = ["aws-sdk-core" "aws-sigv4"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1hpg2yz32pra186xvl0k54kq19s39h6cackaf93lhlpyjgh2m839";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.133.0";
  };
  aws-sdk-sqs = {
    dependencies = ["aws-sdk-core" "aws-sigv4"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0cxap9c21mmx26b97rrll4ylhv9rgqg9pv27p78a9g1wlas9yv43";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.131.0";
  };
  aws-sigv4 = {
    dependencies = ["aws-eventstream"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "003ch8qzh3mppsxch83ns0jra8d222ahxs96p9cdrl0grfazywv9";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.12.1";
  };
  base64 = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0yx9yn47a8lkfcjmigk79fykxvr80r4m1i35q82sxzynpbm7lcr7";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.3.0";
  };
  bcrypt = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0clhya4p8lhjj7hp31inp321wgzb0b5wbwppmya5sw1dikl7400z";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.1.22";
  };
  benchmark = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0v1337j39w1z7x9zs4q7ag0nfv4vs4xlsjx2la0wpv8s6hig2pa6";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.5.0";
  };
  benchmark-ips = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "07cvi8z4ss6nzf4jp8sp6bp54d7prh6jg56dz035jpajbnkchaxp";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.14.0";
  };
  bigdecimal = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0rng45p4vc3f6nac44cnylwch7rj4zsff3icdz6c7garwpjy3sv1";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.1.3";
  };
  bootsnap = {
    dependencies = ["msgpack"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1drb6a74qfzdilyjfx6vhcmps4mj15h14zmw4k9y7xbbvbf4kmzh";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.26.2";
  };
  browser = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0bffb8dddrg6zn8c74swhy8mq2mysb195hi7chwwj9c8g2am4798";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "6.2.0";
  };
  builder = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0pw3r2lyagsxkm71bf44v5b74f7l9r7di22brbyji9fwz791hya9";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.3.0";
  };
  business_time = {
    dependencies = ["activesupport" "tzinfo"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0sbg0bvx5cbk2n1wfasfcvf2nmrli6rpd0qvf0l96qayzwfxsb6n";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.13.0";
  };
  cadmus = {
    dependencies = ["liquid" "rails"];
    groups = ["default"];
    platforms = [];
    source = {
      fetchSubmodules = false;
      rev = "0c44601c3e74323e37eaf55d47412d3f3e292b78";
      sha256 = "1bbhfzqghwycv2jay4q7fm39pv14v02nb20lvnipz6cscr0yzxmf";
      type = "git";
      url = "https://github.com/gively/cadmus.git";
    };
    targets = [];
    version = "0.7.1";
  };
  cadmus_navbar = {
    dependencies = ["acts_as_list" "cadmus" "rails"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0zm70znii9qpwk6javzp2km7bygdiighkcbcsm3gzkyy2irhrapn";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.1.0";
  };
  capybara = {
    dependencies = ["addressable" "matrix" "mini_mime" "nokogiri" "rack" "rack-test" "regexp_parser" "xpath"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1vxfah83j6zpw3v5hic0j70h519nvmix2hbszmjwm8cfawhagns2";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.40.0";
  };
  cgi = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1fzqwshg1xzbdm97havskfp6wifsgbjii00dzba0y6bih4lk1jk1";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.5.2";
  };
  civil_service = {
    dependencies = ["activemodel"];
    groups = ["default"];
    platforms = [];
    source = {
      fetchSubmodules = false;
      rev = "bba59c4a91c3ca61386cfca2f723031ba097da93";
      sha256 = "12pp0w2bdrjdw205wjxyi9yd0g758qfijsbg47gdzf4fyh76x9fs";
      type = "git";
      url = "https://github.com/neinteractiveliterature/civil_service.git";
    };
    targets = [];
    version = "2.3.0";
  };
  cloudwatch_scheduler = {
    dependencies = ["aws-sdk-cloudwatchevents" "aws-sdk-sqs" "rails" "shoryuken"];
    groups = ["default"];
    platforms = [];
    source = {
      fetchSubmodules = false;
      rev = "1c239f5f2cd46a55f6547d16f4740a7ecdce44e7";
      sha256 = "1cps5dkdxi2m29db2w4h6j5x7a0j1gq2jmpadn46hx7vyfqggcaj";
      type = "git";
      url = "https://github.com/neinteractiveliterature/cloudwatch_scheduler.git";
    };
    targets = [];
    version = "1.1.1";
  };
  coderay = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0jvxqxzply1lwp7ysn94zjhh57vc14mcshw1ygw14ib8lhc00lyw";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1.3";
  };
  concurrent-ruby = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1qfi2ns3zwkgq616fc127xiqhan7g7m7gqpwriwcr34nds1vxwdj";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.3.8";
  };
  connection_pool = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0pnbi727fxfsaxzyjafzyx08w0pgw3fs5s067rsrd4q3w0zfxy70";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.0.3";
  };
  crass = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1zjfw8xs3zlqaa07s4m500x84i6437l9r9mk4dwqx7y5lb3la0bs";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.0.8";
  };
  csv = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1y5rf6g10xb9yp526j84ag7in0r2gx767ssmsij8dni8crpz38qm";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.3.7";
  };
  cuprite = {
    dependencies = ["capybara" "ferrum"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1549n327nmniq7csz2n3q9cb0bx4mmpv9kadvdkg0ydylw64wscq";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.20.1";
  };
  database_cleaner-active_record = {
    dependencies = ["activerecord" "database_cleaner-core"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1203q6zdw14vwmnr2hw0d6b1rdz4d07w3kjg1my1zhw862gnnac8";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.2.2";
  };
  database_cleaner-core = {
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0v44bn386ipjjh4m2kl53dal8g4d41xajn2jggnmjbhn6965fil6";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.0.1";
  };
  date = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "105m4y6iwannk0vmn43px6rh8mlczp1bispq6hsxksr49rf99b0q";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.6.0";
  };
  dead_end = {
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1sq78f826rw4nf6gn4i8xx4yijmgw2va260nbd0wbd1vk4w88p39";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.0.0";
  };
  debug = {
    dependencies = ["irb" "reline"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1djjx5332d1hdh9s782dyr0f9d4fr9rllzdcz2k0f8lz2730l2rf";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.11.1";
  };
  derailed_benchmarks = {
    dependencies = ["base64" "benchmark-ips" "bigdecimal" "drb" "get_process_mem" "heapy" "logger" "memory_profiler" "mini_histogram" "mutex_m" "ostruct" "rack" "rack-test" "rake" "ruby-statistics" "ruby2_keywords" "thor"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0fa4bl6afnqqq55fp45bmwin02dgrw7zq9zwv2f1rm6y9xk80hk5";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.2.1";
  };
  device_detector = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ycwbakxxir8dwh2fwg47hvi05dvp1s20fqr3yh8lbmb5kj3zzn5";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1.3";
  };
  devise = {
    dependencies = ["bcrypt" "orm_adapter" "railties" "responders" "warden"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1hacqyck22k7g9qr9n5wwq32vg02hwwjv7kqxrb4xrslb2wg41fn";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "5.0.4";
  };
  devise-doorkeeper = {
    dependencies = ["devise" "doorkeeper" "rails"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1fzsm6l3rqkb44s2n7wfbrcb2sjmci6990l0yi13vi492dzp0rnj";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.2.0";
  };
  devise-encryptable = {
    dependencies = ["devise"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "13lxlnah7q7d7yb145hnnlpp0nmf0zyp36l40r4k7qrr875qrk4x";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.3.0";
  };
  domain_prefix = {
    dependencies = ["json" "simpleidn"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1k8hqcz5bx62zjfkx4lipg0gycvc4g1dvgbpf8wk8mgdadyphbpk";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.0.20241203";
  };
  doorkeeper = {
    dependencies = ["railties"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0x8k7zm8xfahg33v4nlljq5y85ak2qqxq28ndlcxngi230s44ib3";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "5.9.10";
  };
  doorkeeper-jwt = {
    dependencies = ["doorkeeper" "jwt"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "054w972fccg5id4v0rafhppv98hb9v3sv8gfk68kpxc933dd7igl";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.4.5";
  };
  doorkeeper-openid_connect = {
    dependencies = ["doorkeeper" "jwt"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0vi40a0wy1wkkzk9nqpm6wlcd78k645kmyry3v8dsql28gksmz9y";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.1.0";
  };
  dotenv = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "17b1zr9kih0i3wb7h4yq9i8vi6hjfq07857j437a8z7a44qvhxg3";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.2.0";
  };
  dotenv-rails = {
    dependencies = ["dotenv" "railties"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1axy0frn3xn3jf1gdafx5rzz843551q1ckwcbp4zy8m69dajazk5";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.2.0";
  };
  drb = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0wrkl7yiix268s2md1h6wh91311w95ikd8fy8m5gx589npyxc00b";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.2.3";
  };
  erb = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "14pfj6zn0p1hxj6s6s0r7d424wap8zl9zxf89nj79y8fbg16vjn5";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "6.0.7";
  };
  erubi = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1naaxsqkv5b3vklab5sbb9sdpszrjzlfsbqpy7ncbnw510xi10m0";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.13.1";
  };
  eu_central_bank = {
    dependencies = ["bigdecimal" "money" "nokogiri"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1xcr4rg9lw4c3fpmrs4pmrg7wnk7liy0spv0pjv1qpj6p8wfllky";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.0.0";
  };
  factory_bot = {
    dependencies = ["activesupport"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "12abilw8sgpr8250x5rfjs1cll62r1p1pv3slak81j8fcasv7h8z";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "6.6.0";
  };
  factory_bot_rails = {
    dependencies = ["factory_bot" "railties"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0s3dpi8x754bwv4mlasdal8ffiahi4b4ajpccnkaipp4x98lik6k";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "6.5.1";
  };
  faker = {
    dependencies = ["i18n"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1z1yfmqwml3gr1hjnjx6qbchmvr29j6z317wlhkhzabkvw4b6iy1";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.8.0";
  };
  faraday = {
    dependencies = ["faraday-net_http" "json" "logger"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "13r8mjqk8slscc8rxfhfrqglks131sb78ay4dklcafd7xm6ia247";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.15.1";
  };
  faraday-net_http = {
    dependencies = ["net-http"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0difl8kbbhz1pirq8prpv42p0rgqfrrz8gfc93h4wx9q9v1r8w1f";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.5.0";
  };
  ferrum = {
    dependencies = ["addressable" "base64" "concurrent-ruby" "websocket-driver"];
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1p0jfvs4klj3pkrfi516yd7iz7qa30lzmbvydyindv287rzx4crs";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.20.1";
  };
  ffi = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1kqasqvy8d7r09ri4n6bkdwbk63j7afd9ilsw34nzlgh0qp69ldw";
      target = "ruby";
      type = "gem";
    };
    targets = [{
      remotes = ["https://rubygems.org"];
      sha256 = "06q06ylk32yma6ms84sd6cxhlcvp1sbbyal58q51n98r2jpil1qr";
      target = "arm64-darwin";
      targetCPU = "arm64";
      targetOS = "darwin";
      type = "gem";
    } {
      remotes = ["https://rubygems.org"];
      sha256 = "0bbmph141hwnn3m4k8hx8nhy1imfjpz87h595ww4n1xf5r6b2gcx";
      target = "x86_64-linux-gnu";
      targetCPU = "x86_64";
      targetOS = "linux";
      type = "gem";
    }];
    version = "1.17.4";
  };
  fiber-storage = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1qa0j9qjwav9xb0n3isx0rbh0942xrfback392n6vs8bidnmp3pl";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.0.1";
  };
  flamegraph = {
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1p785nmhdzbwj0qpxn5fzrmr4kgimcds83v4f95f387z6w3050x6";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.9.5";
  };
  get_process_mem = {
    dependencies = ["ffi"];
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1fkyyyxjcx4iigm8vhraa629k2lxa1npsv4015y82snx84v3rzaa";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.2.7";
  };
  globalid = {
    dependencies = ["activesupport"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "04gzhqvsm4z4l12r9dkac9a75ah45w186ydhl0i4andldsnkkih5";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.3.0";
  };
  graphql = {
    dependencies = ["base64" "fiber-storage" "logger"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0in24bkiwn1kzbxx6adcai4qr97ffzi6sj1d47daaiirgf9q2paq";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.6.16";
  };
  graphql-rails_logger = {
    dependencies = ["actionpack" "activesupport" "railties" "rouge"];
    groups = ["development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "03c695pvsvi4z2bhk7l1zyyljnfr0hwksc8aali2kaj6fl27q4fj";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.2.5";
  };
  haml = {
    dependencies = ["temple" "thor" "tilt"];
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1p29mxpzffzqbdxr61gablfwkr62r926j1ba5h0nqkv3jfnsyqkm";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "6.2.5";
  };
  heapy = {
    dependencies = ["thor"];
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1sl56ma851i82g3ax08igbn48igriiy152xzx30wgzv1bn21w53l";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.2.0";
  };
  holidays = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "06ii3ffwnmg6n1bfm99ja91vz1hj7ns2qlg2wxw3gcyj9xpwykq2";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "11.8.0";
  };
  i18n = {
    dependencies = ["concurrent-ruby"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1dfikmmd9dllirsfq0kjiyxpmlq0afkxm5sslsr97r9g85ifpy80";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.15.2";
  };
  icalendar = {
    dependencies = ["base64" "ice_cube" "logger"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1db8ryy8gs96gj70cnayg14ql99mbd03vwq2qxhr8synb61c7vp1";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.14.0";
  };
  ice_cube = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1gpwlpshsjlld53h1f999p0azd9jdlgmhbswa19wqjjbv9fv9pij";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.17.0";
  };
  image_processing = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0wrfszkyjxm8qj6fnbc6y06w9bl7gx6n3956xxzc16sk409k20n7";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.2.2";
  };
  io-console = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1m8lcj26n7qchw21iaafk96mzsqj8b6kjnr455k430269jzrppc3";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.9.5";
  };
  irb = {
    dependencies = ["pp" "prism" "rdoc" "reline"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "09qxdzs9q1780jmnp40nbzs42p2fl939z476l83gxjfnpnn5dvjm";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.19.0";
  };
  jmespath = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1cdw9vw2qly7q7r41s7phnac264rbsdqgj4l0h4nqgbjb157g393";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.6.2";
  };
  json = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1n1v9rhb19cnf1a89s6yvvhw394jy8qnqx9sg8bn12g5zpwcrrrw";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.1.0";
  };
  jwt = {
    dependencies = ["base64"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ip59r7z8mjwy1rq0pp53kxhvkjb5d942rpn7hiliha1qgxk9k24";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.3.0";
  };
  language_server-protocol = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1w5p8c2145lmqzr25bxh4ikzjm6k8y1k5lriqqdpw9pq730w1wjy";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.17.0.6";
  };
  lint_roller = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "11yc0d84hsnlvx8cpk4cbj6a4dz9pk0r1k29p0n1fz9acddq831c";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1.0";
  };
  liquid = {
    dependencies = ["bigdecimal" "strscan"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0rbhq706lz7j1gzqnx2k6dw7mlkvacqs7izx7d6pm3755qmhq0p1";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "5.14.0";
  };
  listen = {
    dependencies = ["logger" "rb-fsevent" "rb-inotify"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0g3q0hnxnskhlchlyghxdc5dk41pzxr27pd4gms4iwspas2k4gsc";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.10.1";
  };
  logger = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "00q2zznygpbls8asz5knjvvj2brr3ghmqxgr83xnrdj4rk3xwvhr";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.7.0";
  };
  lograge = {
    dependencies = ["actionpack" "activesupport" "logger" "railties" "request_store"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "14bas220zv5913lf8ginnv2z897rl8jp3wrw4ijsfmm3a8iyvm9j";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.16.0";
  };
  loofah = {
    dependencies = ["crass" "nokogiri"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0p0qn2srqbak6x75qp2igv0bfcijb46m6q7m1pl7sancy3p18psl";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.25.3";
  };
  mail = {
    dependencies = ["logger" "mini_mime" "net-imap" "net-pop" "net-smtp"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1s30l5z7jkazgi4m6l6mh80rgsyhh2pp1pa5h70xclsj8z54wmq6";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.9.1";
  };
  marcel = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1xqlhq0z001b1h2i6hr7x0nrmszrd2aii1w8li1lm4gw2j45gsqn";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1.1";
  };
  matrix = {
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0nscas3a4mmrp1rc07cdjlbbpb2rydkindmbj3v3z5y1viyspmd0";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.4.3";
  };
  memory_profiler = {
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1y58ba08n4lx123c0hjcc752fc4x802mjy39qj1hq50ak3vpv8br";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1.0";
  };
  method_source = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1pnyh44qycnf9mzi1j6fywd5fkskv3x7nmsqrrws0rjn5dd4ayfp";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.0.0";
  };
  mini_histogram = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "156xs8k7fqqcbk1fbf0ndz6gfw380fb2jrycfvhb06269r84n4ba";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.3.1";
  };
  mini_mime = {
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1vycif7pjzkr29mfk4dlqv3disc5dn0va04lkwajlpr1wkibg0c6";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1.5";
  };
  mini_portile2 = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "12f2830x7pq3kj0v8nz0zjvaw02sv01bqs1zwdrc04704kwcgmqc";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.8.9";
  };
  minitest = {
    dependencies = ["drb" "prism"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0vh733a365lw2dpa8zvdmr35715kfrm9hqsli8g67248maakadzz";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "6.1.0";
  };
  minitest-focus = {
    dependencies = ["minitest"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "03l1vl873zpywjfj6sda9mx7f5b35cximi7zv29dkcnwwb5ifi9r";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.4.1";
  };
  minitest-mock = {
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1c2m99b9hgvhyhzv0nxjqlgymr0vmxpalzlq41lrcyj1hmqysh3h";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "5.27.0";
  };
  minitest-reporters = {
    dependencies = ["ansi" "builder" "minitest" "ruby-progressbar"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "11531cvklpc1j7m8il5i70dqrwmnd7qlsi95wn51glrsnw7jircc";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.8.0";
  };
  minitest-spec-rails = {
    dependencies = ["minitest" "railties"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0kr564w404ivf0wasj42ql7lpp4zpbxymw5vyasqmnbwxn6n78nd";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.4.1";
  };
  monetize = {
    dependencies = ["money"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1fiaz18miw7df7ciavshqjc7kc39glynxm8pb2li3zgrvz580a8m";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.0.0";
  };
  money = {
    dependencies = ["bigdecimal" "i18n"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0q1c5sr6xng25zm64fzzj3vj0kazmzalspswvb70s68xzp0jfp31";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.0.2";
  };
  money-rails = {
    dependencies = ["activesupport" "monetize" "money" "railties"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1bjvr708g6k5lmvs98ixwhj15x20w99fnbj5pzkj3llq3j71rggl";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.0.0";
  };
  msgpack = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0cyzl8cshfjkvhm980aak1fp5czli9zjqpfrx3k4g42z3dvfrvyz";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.8.7";
  };
  mutex_m = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0l875dw0lk7b2ywa54l0wjcggs94vb7gs8khfw9li75n2sn09jyg";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.3.0";
  };
  net-http = {
    dependencies = ["net-protocol" "uri"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "09vwk1kab811q2qyk9yh9imc6naz22zzfarzqirljwh5gbizcbqs";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.10.0";
  };
  net-imap = {
    dependencies = ["date" "net-protocol"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1ngnmjc7vc4k06dyapgid2gxc4si6yr092sidfps6r3v49ibnc7b";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.6.8";
  };
  net-pop = {
    dependencies = ["net-protocol"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1wyz41jd4zpjn0v1xsf9j778qx1vfrl24yc20cpmph8k42c4x2w4";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.1.2";
  };
  net-protocol = {
    dependencies = ["timeout"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ly8x39gr23blbmfwfyy14lb2v9kg8bj5x0b2r2llyb4dy60rygr";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.4.0";
  };
  net-smtp = {
    dependencies = ["net-protocol"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0g4gcydr0hza3wiizny0p5q4phl3fkhfsa4r5xir8bbb9p03q41m";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.5.2";
  };
  nio4r = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "18fwy5yqnvgixq3cn0h63lm8jaxsjjxkmj8rhiv8wpzv9271d43c";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.7.5";
  };
  nokogiri = {
    dependencies = ["mini_portile2" "racc"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1f4jz6yhzj7i8gl2zif4pld2plxalkf6pcbp4y3qzcacql3lbsdb";
      target = "ruby";
      type = "gem";
    };
    targets = [{
      remotes = ["https://rubygems.org"];
      sha256 = "0fyxymdalnyp57bf62580ikwnjbqw3yhd2fz5xqlww9g8v5mr1i5";
      target = "x86_64-linux-gnu";
      targetCPU = "x86_64";
      targetOS = "linux";
      type = "gem";
    } {
      remotes = ["https://rubygems.org"];
      sha256 = "0hhiajfqdl1rlj6k898rxigmb60cd3xw4b2slcxbqgw7yhjpyzgj";
      target = "arm64-darwin";
      targetCPU = "arm64";
      targetOS = "darwin";
      type = "gem";
    }];
    version = "1.19.7";
  };
  oj = {
    dependencies = ["bigdecimal"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "01h3fdx98f9m7kvqkgcr4yn8s3cjf8y1fcwcpxmbm718xy9rnbba";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.17.8";
  };
  openssl = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1hj7wwp4r3jhvnyd8ik85wbs25cq1w61r28pv6ddyn5fd0lasdqh";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.0.2";
  };
  orm_adapter = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1fg9jpjlzf5y49qs9mlpdrgs5rpcyihq1s4k79nv9js0spjhnpda";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.5.0";
  };
  ostruct = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "04nrir9wdpc4izqwqbysxyly8y7hsfr4fsv69rw91lfi9d5fv8lm";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.6.3";
  };
  parallel = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0vvs2sar7wnw70j1jc1kv1k23m5grc0ci3bbrcf6mkh18683wnpp";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.3.0";
  };
  parser = {
    dependencies = ["ast" "racc"];
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1jnyqgbbzglgk1fzfr1rcqxi3jxki7gs8av9iz3b01gyq9irnbz0";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.3.13.0";
  };
  pg = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1yval9rdbc0p01dmf8zwm953w1hk0ggdp1pgr7a87s442983ddgp";
      target = "ruby";
      type = "gem";
    };
    targets = [{
      remotes = ["https://rubygems.org"];
      sha256 = "0jqf0q6g3y696j8r39s9fpm1a40xq1j09j6chfdmgpcbwaxrba4z";
      target = "arm64-darwin";
      targetCPU = "arm64";
      targetOS = "darwin";
      type = "gem";
    } {
      remotes = ["https://rubygems.org"];
      sha256 = "1dh4sz8qj87lyvv89plf49f33rzwpsxyzm2q4s5lr1rwid24z8nh";
      target = "x86_64-linux";
      targetCPU = "x86_64";
      targetOS = "linux";
      type = "gem";
    }];
    version = "1.7.0";
  };
  pg-aws_rds_iam = {
    dependencies = ["aws-sdk-rds" "pg"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1vyzhh6lk5877kxwjfrs9rz67pm8629zjrwgyrrwzdj5njpi24x6";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.8.0";
  };
  pg_search = {
    dependencies = ["activerecord" "activesupport"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1bych5cnn8ivxfzbmq66wgdw15fl8l0mrqvxgx8cn3cxmn5522wb";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.4.0";
  };
  phonelib = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0rsfw2hbh6l5mbyf5qdf5vnv2ab4v3jf7iw4vqryyx9kpimkzhxl";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.11.0";
  };
  positioning = {
    dependencies = ["activerecord" "activesupport"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ac2bd18mfnd0mx6cmyp4sf6ayxv9ilyf7ywvrzgxqx9znqi0qss";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.5.0";
  };
  pp = {
    dependencies = ["prettyprint"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0w5mha75hs8gdj75g8vl0sxpyp8rzvwq8a4jcmi4ah8cf370zjyz";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.6.4";
  };
  prettier = {
    dependencies = ["syntax_tree" "syntax_tree-haml" "syntax_tree-rbs"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1iavhgs7iahjz28sks5kkml9gr43fx5rpq5l0ql81pkmfv3i0cbi";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.0.4";
  };
  prettier_print = {
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1ybgks9862zmlx71zd4j20ky86fsrp6j6m0az4hzzb1zyaskha57";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.2.1";
  };
  prettyprint = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      fetchSubmodules = false;
      rev = "d9a7ffec2dc009e5518dbcf7841bd792ea94bd96";
      sha256 = "1ymdxx8bmya0mcq30d54ncdc5pmh2minjzk8cznripgyw3ji5d5x";
      type = "git";
      url = "https://github.com/ruby/prettyprint.git";
    };
    targets = [];
    version = "0.2.1";
  };
  prism = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1wq1fqa52h90hynqcbwf35iydnv4fl03y4pvj0rii4qfx9npq2hw";
      target = "ruby";
      type = "gem";
    };
    targets = [{
      remotes = ["https://rubygems.org"];
      sha256 = "1m5z6ff623gc0yilqlq958wkvmypj7yf5cwb1djiwm89rsplgdmj";
      target = "x86_64-linux-gnu";
      targetCPU = "x86_64";
      targetOS = "linux";
      type = "gem";
    } {
      remotes = ["https://rubygems.org"];
      sha256 = "1z4ampl3h8nls5ca2aqggffkgvrxzz9hf2cl8708kz8w04z2w31d";
      target = "arm64-darwin";
      targetCPU = "arm64";
      targetOS = "darwin";
      type = "gem";
    }];
    version = "2.1.0";
  };
  pry = {
    dependencies = ["coderay" "method_source"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0k9kqkd9nps1w1r1rb7wjr31hqzkka2bhi8b518x78dcxppm9zn4";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.14.2";
  };
  pry-rails = {
    dependencies = ["pry"];
    groups = ["development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0garafb0lxbm3sx2r9pqgs7ky9al58cl3wmwc0gmvmrl9bi2i7m6";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.3.11";
  };
  pry-remote = {
    dependencies = ["pry" "slop"];
    groups = ["development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "10g1wrkcy5v5qyg9fpw1cag6g5rlcl1i66kn00r7kwqkzrdhd7nm";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.1.8";
  };
  psych = {
    dependencies = ["date" "stringio"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "02ka2nx3k1sqxf2347gfwh82n1kb3ay6wxpfrkw8s8zks2xmn92b";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "5.5.0";
  };
  public_suffix = {
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "08znfv30pxmdkjyihvbjqbvv874dj3nybmmyscl958dy3f7v12qs";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.0.5";
  };
  puma = {
    dependencies = ["nio4r"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1p7fdhxg6kgxgnn389dw12z3xm5m74wp06yimdg1gl54r4s9lv9s";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.2";
  };
  pundit = {
    dependencies = ["activesupport"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1gcb23749jwggmgic4607ky6hm2c9fpkya980iihpy94m8miax73";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.5.2";
  };
  racc = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0byn0c9nkahsl93y9ln5bysq4j31q8xkf2ws42swighxd4lnjzsa";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.8.1";
  };
  rack = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1k0d8vpg160wjnp344wyn3jp70c8paz3nhglrzninihciz8c2dc2";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.2.9";
  };
  rack-cors = {
    dependencies = ["logger" "rack"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0s1zymxhk7pkzsrgrn5ax862p07s0drbv0qvnq36jq1rvdhvx5bv";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.0.0";
  };
  rack-mini-profiler = {
    dependencies = ["rack"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1q822cwrs4khc4l4jgc6dsnvw7iz46rgchqam2dqs759gw4bmicr";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "5.0.0";
  };
  rack-session = {
    dependencies = ["base64" "rack"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1s7zcxlmg88a6dam4aqbgk9xkpy6dkdfqmmcszkkliy3q3w38m2r";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.1.2";
  };
  rack-test = {
    dependencies = ["rack"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1s212a39z3v1ksgnhvwddsiq2n7dr4cqvzdnq4pmfb00rivx265i";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.3.0";
  };
  rackup = {
    dependencies = ["rack"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0s48d2a0z5f0cg4npvzznf933vipi6j7gmk16yc913kpadkw4ybc";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.3.1";
  };
  rails = {
    dependencies = ["actioncable" "actionmailbox" "actionmailer" "actionpack" "actiontext" "actionview" "activejob" "activemodel" "activerecord" "activestorage" "activesupport" "railties"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1g2hjr78884v1rb7wnhbwvgahk1dc8kfir980vkdcfvis853lp1n";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  rails-controller-testing = {
    dependencies = ["actionpack" "actionview" "activesupport"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "151f303jcvs8s149mhx2g5mn67487x0blrf9dzl76q1nb7dlh53l";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.0.5";
  };
  rails-dom-testing = {
    dependencies = ["activesupport" "minitest" "nokogiri"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "07awj8bp7jib54d0khqw391ryw8nphvqgw4bb12cl4drlx9pkk4a";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.3.0";
  };
  rails-html-sanitizer = {
    dependencies = ["loofah" "nokogiri"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0914z9493y3bjhm1c5hn4yp8djqlfma3qiw24a7gqfb6g9dz87m2";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.7.2";
  };
  railties = {
    dependencies = ["actionpack" "activesupport" "irb" "rackup" "rake" "thor" "tsort" "zeitwerk"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "10lpmaa7klwllkkfl4nh9nqp3vg2fv3i3gl83y0qkg1clssz8bpz";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "8.1.4.1";
  };
  rainbow = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0smwg4mii0fm38pyb5fddbmrdpifwv22zv3d3px2xx497am93503";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.1.1";
  };
  rake = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "009p524zl0p0kfa65nii8wdmaigkmawv9pbvlcffky7islmmp0nb";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "13.4.2";
  };
  rb-fsevent = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1zmf31rnpm8553lqwibvv3kkx0v7majm1f341xbxc0bk5sbhp423";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.11.2";
  };
  rb-inotify = {
    dependencies = ["ffi"];
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0vmy8xgahixcz6hzwy4zdcyn2y6d6ri8dqv5xccgzc1r292019x0";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.11.1";
  };
  rbs = {
    dependencies = ["logger" "tsort"];
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1s2wgrmzqz82lchpjbigliy80si0mbq3162j7cda2cdvwi5pqzdi";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.10.4";
  };
  rbtree = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1z0h1x7fpkzxamnvbw1nry64qd6n0nqkwprfair29z94kd3a9vhl";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.4.6";
  };
  rdoc = {
    dependencies = ["erb" "psych" "tsort"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "14iiyb4yi1chdzrynrk74xbhmikml3ixgdayjma3p700singfl46";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.2.0";
  };
  readline = {
    dependencies = ["reline"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0shxkj3kbwl43rpg490k826ibdcwpxiymhvjnsc85fg2ggqywf31";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.0.4";
  };
  redcarpet = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0iglapqs4av4za9yfaac0lna7s16fq2xn36wpk380m55d8792i6l";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.6.1";
  };
  regexp_parser = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0fwarpnqm6b0vy4yx3mhrx12zi0v435d0ywm8q4z1rjp9y0lf18x";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.13.4";
  };
  reline = {
    dependencies = ["io-console"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0gaq2lc463ap1srz7y5kh2p4dxazs7vjrpiby58d9yfvan72s0av";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.7.0";
  };
  request_store = {
    dependencies = ["rack"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1jw89j9s5p5cq2k7ffj5p4av4j4fxwvwjs1a4i9g85d38r9mvdz1";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.7.0";
  };
  responders = {
    dependencies = ["actionpack" "railties"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0npm7nyld47f516idsmslfhypp7gm3jcl90ml5c68vz11anddhl9";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.2.0";
  };
  rexml = {
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0hninnbvqd2pn40h863lbrn9p11gvdxp928izkag5ysx8b1s5q0r";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.4.4";
  };
  rollbar = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0gks0hil888vzq0iyj2cxsb0afcdzws5y151yhs4d1acr21jfpb5";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.8.0";
  };
  rouge = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "197k0vskf72wxx0gzwld2jzg27bb7982xlvnzy9adlvkzp7nh8vf";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.26.1";
  };
  rubocop = {
    dependencies = ["json" "language_server-protocol" "lint_roller" "parallel" "parser" "rainbow" "regexp_parser" "rubocop-ast" "ruby-progressbar" "unicode-display_width"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1xigcyc13kn6lc0gs59m2zw5p7y508bqm1jgacx1rsg88sngwxzx";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.92.3";
  };
  rubocop-ast = {
    dependencies = ["parser" "prism"];
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1jygkajmq51dh7k4prmwgpljm5jf4wsql1q9v5r3h6qrdgii3hqf";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.51.0";
  };
  rubocop-capybara = {
    dependencies = ["lint_roller" "rubocop"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "15jhizhr01p1598av8439xy1a7bvbwwgmgzp8fv750hp0h5r04hp";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.1.0";
  };
  rubocop-factory_bot = {
    dependencies = ["lint_roller" "rubocop"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1jzhj9fi1h9rh7z2j6m78hl7c3av36fpacg12wrifi24281gq5sb";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.28.0";
  };
  rubocop-graphql = {
    dependencies = ["lint_roller" "rubocop"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0nq4ssjjw8ryivnckcj9cd0q29c54dj547839w9y92n34b8sn8gv";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.9.0";
  };
  rubocop-performance = {
    dependencies = ["lint_roller" "rubocop" "rubocop-ast"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1kk1dla4c2bn4ks6b18zrf2b3i0c1gmp0yvq3kp6i8v2s1s17szf";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.27.0";
  };
  rubocop-rails = {
    dependencies = ["activesupport" "lint_roller" "rack" "rubocop" "rubocop-ast"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "01igzbkf7w1ixrqbrn7amii5c0jviw5w5gki0c2y75gs5r9pqavf";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.38.0";
  };
  rubocop-rspec = {
    dependencies = ["lint_roller" "regexp_parser" "rubocop"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1qk5bx4vg7n17i9475h6dqkhay9m3s6vanq9y35hxl9cb762wghb";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.10.2";
  };
  ruby-progressbar = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0cwvyb7j47m7wihpfaq7rc47zwwx9k4v7iqd9s1xch5nm53rrz40";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.13.0";
  };
  ruby-statistics = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1agj0yspf9haqvqlq5dy3gqn8xc0h9a1dd7c44fi9rn4bnyplsbx";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.1.0";
  };
  ruby-vips = {
    dependencies = ["ffi" "logger"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0x2k5x272m2zs0vmznl2jac14bj9a2g0365xxcnr2s9rq41fr1g6";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.3.0";
  };
  ruby2_keywords = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1vz322p8n39hz3b4a9gkmz9y7a5jaz41zrm2ywf31dvkqm03glgz";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.0.5";
  };
  safely_block = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "00q1148yzwhfgzqw3myirz31cqfsg71zh3646c99r9q0qhmk8b3q";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.5.0";
  };
  scheduled_value = {
    dependencies = ["sorted_set"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1d6z632myw5idjwz2cfg1afs7720fjf22lmw3gqypx28sb7365r7";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.4.0";
  };
  securerandom = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1cd0iriqfsf1z91qg271sm88xjnfd92b832z49p1nd542ka96lfc";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.4.1";
  };
  sentry-rails = {
    dependencies = ["railties" "sentry-ruby"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1zwq3gw5pwv2h6za3404q9shc4adf5zkvqprgxgxwvpnp32yqh99";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.3.0";
  };
  sentry-ruby = {
    dependencies = ["bigdecimal" "concurrent-ruby" "logger"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "197iv75csvqryw7nchp08209kbrqrrhzla5clf67g730ws1g15xh";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.3.0";
  };
  shoryuken = {
    dependencies = ["aws-sdk-sqs" "concurrent-ruby" "thor" "zeitwerk"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "09cc48n8bvp8xdagqg92snbcbdf3d57s1vq8069zlxkp9m8wyvsp";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.0.4";
  };
  simplecov = {
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "118fdpg7h1ny1fz6kmiyz6gccvwmb23h6bhsi1hdpf7ib4byq8ia";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.3.2";
  };
  simplecov-cobertura = {
    dependencies = ["rexml" "simplecov"];
    groups = ["test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1sh15q3lv4imxn5awgnjibkj6lrh2632ligm8idm9spcn5ck3yz4";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.0.0";
  };
  simpleidn = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0a9c1mdy12y81ck7mcn9f9i2s2wwzjh1nr92ps354q517zq9dkh8";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.2.3";
  };
  slop = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "00w8g3j7k7kl8ri2cf1m58ckxk8rn350gp4chfscmgv6pq1spk3n";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.6.0";
  };
  sorted_set = {
    dependencies = ["rbtree"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "10zf4isl10i60zlxpsngzp4vbs1b8a3qx8ijsyvwvkvbdfqixh5s";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1.0";
  };
  sprockets = {
    dependencies = ["concurrent-ruby" "rack"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "15rzfzd9dca4v0mr0bbhsbwhygl0k9l24iqqlx0fijig5zfi66wm";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.2.1";
  };
  sprockets-rails = {
    dependencies = ["actionpack" "activesupport" "sprockets"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "17hiqkdpcjyyhlm997mgdcr45v35j5802m5a979i5jgqx5n8xs59";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.5.2";
  };
  stackprof = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "014s1zxlxcw35shislar3y1i3mqa0c6gh3m21js14q1q5zharhjf";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.2.28";
  };
  stringio = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1q92y9627yisykyscv0bdsrrgyaajc2qr56dwlzx7ysgigjv4z63";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.2.0";
  };
  stripe = {
    dependencies = ["bigdecimal" "logger"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ga25m0ns326mxhixgfh1m5ysf194by533ng33s22ih53did91k1";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "21.1.0";
  };
  strscan = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "17k75zrwf4ag9yl9wjjkcb90zrm4r5jigdzv3zr5jm9239hxpqma";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.1.8";
  };
  syntax_tree = {
    dependencies = ["prettier_print"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ggi6p7xxjsj42q8pp0yz6z7dbwlbr6fjbs4qnafr667jab5mqjn";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "6.3.0";
  };
  syntax_tree-haml = {
    dependencies = ["haml" "prettier_print" "syntax_tree"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0nb335cn093qnc3hyb8s4vbgn8apwz019m4dj15hz2y2gmkpdxnw";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.0.3";
  };
  syntax_tree-rbs = {
    dependencies = ["prettier_print" "rbs" "syntax_tree"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1g9n2i99y6b5l3x3vp2nk0fss2x0b2gd1h5hynbs2y4ab35jhrsr";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.0.0";
  };
  temple = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0fwia5hvc1xz9w7vprzjnsym3v9j5l9ggdvy70jixbvpcpz4acfz";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.10.3";
  };
  thor = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0wsy88vg2mazl039392hqrcwvs5nb9kq8jhhrrclir2px1gybag3";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.5.0";
  };
  tilt = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0p3l7v619hwfi781l3r7ypyv1l8hivp09r18kmkn6g11c4yr1pc2";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.3.0";
  };
  timeout = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1jxcji88mh6xsqz0mfzwnxczpg7cyniph7wpavnavfz7lxl77xbq";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.6.1";
  };
  tsort = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "17q8h020dw73wjmql50lqw5ddsngg67jfw8ncjv476l5ys9sfl4n";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.2.0";
  };
  twilio-ruby = {
    dependencies = ["faraday" "jwt" "nokogiri"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1ky2anms0ym7bdmb4z846z5q944cjc05z1gyz3vj6ppz06xlizb0";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.13.1";
  };
  typeprof = {
    dependencies = ["prism" "rbs"];
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1hx7djm1wmvd6v9mszyzxrv5msy90i0vrm75qdyx53jp9ml7qxxa";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.33.2";
  };
  tzinfo = {
    dependencies = ["concurrent-ruby"];
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "16w2g84dzaf3z13gxyzlzbf748kylk5bdgg3n1ipvkvvqy685bwd";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.0.6";
  };
  tzinfo-data = {
    dependencies = ["tzinfo"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0w4n63aya77a10hxl17my6qjxjr1n3756a2g8vbk0rzjl3as7zgy";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.2026.6";
  };
  unicode-display_width = {
    dependencies = ["unicode-emoji"];
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "04xnl0zwpjjvxipd6rdnxkm11pfhbhhi3179yzv51nqi9dmacyjb";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.3.0";
  };
  unicode-emoji = {
    groups = ["default" "development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1kp89lja8ii7l6f0bq5vdxq1p3kxr3a2qmmhdc38qdwh6akjzh0i";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.3.0";
  };
  uri = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1yv9n69g99wldlx04q3my61jy5cf75z5xvd0n1465vxvxac2wac9";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.1.2";
  };
  useragent = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0i1q2xdjam4d7gwwc35lfnz0wyyzvnca0zslcfxm9fabml9n83kh";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.16.11";
  };
  warden = {
    dependencies = ["rack"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1l7gl7vms023w4clg02pm4ky9j12la2vzsixi2xrv9imbn44ys26";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "1.2.9";
  };
  websocket-driver = {
    dependencies = ["base64" "websocket-extensions"];
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0ij19k6034x0c4hw0ywa7wnk5s912r8aq0hhjss10d5z36q5dicp";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.8.2";
  };
  websocket-extensions = {
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0hc2g9qps8lmhibl5baa91b4qx8wqw872rgwagml78ydj8qacsqw";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.1.5";
  };
  will_paginate = {
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1fbmm0amshidnw0qx0nqjzfyy7if8xy6m5bm8lkksf8xprp24yqh";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "4.0.1";
  };
  with_advisory_lock = {
    dependencies = ["activerecord"];
    groups = ["default"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0dh37dbyap33l0j8yylcqrgn5wy0nis0pf2j4z20rddi3x2f53b3";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "7.6.0";
  };
  xpath = {
    dependencies = ["nokogiri"];
    groups = ["default" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0bh8lk9hvlpn7vmi6h4hkcwjzvs2y0cmkk3yjjdr8fxvj6fsgzbd";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "3.2.0";
  };
  yard = {
    groups = ["development"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "0lfwngmsz3xq9k9la9890cqpm4vk3rda4171yzms7f3w7x4i3qjj";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "0.9.45";
  };
  zeitwerk = {
    groups = ["default" "development" "test"];
    platforms = [];
    source = {
      remotes = ["https://rubygems.org"];
      sha256 = "1rcjpgyzmdxp8rdw466156fmr588k9q1wg8j42g0dkk7hid1519c";
      target = "ruby";
      type = "gem";
    };
    targets = [];
    version = "2.8.3";
  };
}