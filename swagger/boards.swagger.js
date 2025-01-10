/**
 * @swagger
 * tags:
 *   name: Board
 *   description: 게시판 API
 *
 * @swagger
 * /boards:
 *   get:
 *     summary: 게시글 전체 가져오기
 *     tags: [Board]
 *     responses:
 *       200:
 *         description: 조회 결과
 *         content: 
 *           application/json:
 *              schema:
 *                  type: array
 *                  items: 
 *                      properties: 
 *                          number:
 *                              type: int
 *                              example: 3
 *                              description: 인덱스
 *                          writer:
 *                              type: string
 *                              example: 철수
 *                              description: 작성자
 *                          title:
 *                              type: string
 *                              example: 제목입니다
 *                              description: 제목
 *                          contents:
 *                              type: string
 *                              example: 내용입니다
 *                              description: 내용
 */