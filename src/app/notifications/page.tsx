export default function Notifications() {
  return (
    <div className="m-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-orange-100 p-4">
          <h1>タイトル1</h1>
          <div className="flex flex-row justify-between">
            <div>日付1</div>
            <div>バッジ1</div>
          </div>
        </div>
        <div className="bg-orange-100 p-4">
          <h1>タイトル2</h1>
          <div className="flex flex-row justify-between">
            <div>日付2</div>
            <div>バッジ2</div>
          </div>
        </div>

        <div className="bg-orange-100 p-4">
          <h1>タイトル3</h1>
          <div className="flex flex-row justify-between">
            <div>日付3</div>
            <div>バッジ3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
