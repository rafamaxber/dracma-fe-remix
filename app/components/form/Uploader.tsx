export function Uploader(props) {

  return (
    <section className="container">
      <input {...props}  type='file' multiple accept='image/*' />
    </section>
  );
}
