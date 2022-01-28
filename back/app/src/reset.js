'use strict';

const sequelize = require('./sequelize');
const Article = require('./models/Article');
const User = require('./models/User');

(async () => {
  try {
    await sequelize.sync({ force: true });

    await sequelize.transaction(async transaction => {
      await User.create(
        {
          username: '総務部',
          // 「password」というパスワードをハッシュ化したデータ
          password: '$2b$10$DyM/sTeX6mnzfr8QIqvx2eU7YxbeDDMhc7DSpu6LXcekqoFH3epqi',
          createdAt: new Date('2020-01-06T10:00:00+09:00'),
        },
        { transaction },
      );

      await Article.create(
        {
          title: 'Internet Explorerサポート終了のお知らせ',
          text: `Windows 7のサポート終了に伴い、弊社ポータルサイトのInternet Explorerサポートを終了しました。
今後はGoogle Chromeをご利用ください。`,
          username: '総務部',
          createdAt: new Date('2020-01-14T10:30:00+09:00'),
        },
        { transaction },
      );

      await Article.create(
        {
          title: '新人歓迎会のお知らせ',
          text: `4月3日(金)の18時から新人歓迎会を実施します。
会社と同じビル1階の居酒屋で実施します。
会費は会社負担です。`,
          username: '総務部',
          createdAt: new Date('2020-03-19T16:30:00+09:00'),
        },
        { transaction },
      );

      await Article.create(
        {
          title: '健康診断受診のお願い',
          text: `健康診断のお知らせを、弊社ポータルサイトに載せておきました。
各自で予約し、受信してください。`,
          username: '総務部',
          createdAt: new Date('2020-04-01T09:10:00+09:00'),
        },
        { transaction },
      );
    });
  } finally {
    await sequelize.close();
  }
})();
