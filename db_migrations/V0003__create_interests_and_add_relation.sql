-- Создаем таблицу интересов
CREATE TABLE IF NOT EXISTS t_p11987519_companion_match_1.interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Заполняем стандартными интересами
INSERT INTO t_p11987519_companion_match_1.interests (name) VALUES
    ('Книги'),
    ('Путешествия'),
    ('Музыка'),
    ('Спорт'),
    ('Бизнес'),
    ('Технологии'),
    ('Искусство'),
    ('Кино'),
    ('Фотография'),
    ('Кулинария'),
    ('Наука'),
    ('Мода'),
    ('Психология'),
    ('Автомобили'),
    ('Игры')
ON CONFLICT (name) DO NOTHING;

-- Добавляем новый столбец interest_id в user_interests
ALTER TABLE t_p11987519_companion_match_1.user_interests 
ADD COLUMN IF NOT EXISTS interest_id INTEGER REFERENCES t_p11987519_companion_match_1.interests(id);

-- Заполняем interest_id на основе существующих данных
UPDATE t_p11987519_companion_match_1.user_interests ui
SET interest_id = i.id
FROM t_p11987519_companion_match_1.interests i
WHERE ui.interest = i.name AND ui.interest_id IS NULL;

-- Добавляем уникальный индекс
CREATE UNIQUE INDEX IF NOT EXISTS user_interests_unique_idx 
ON t_p11987519_companion_match_1.user_interests(user_id, interest_id);